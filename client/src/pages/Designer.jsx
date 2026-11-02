import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  FiArrowLeft, FiBox, FiChevronDown, FiCircle, FiClock, FiCopy,
  FiDownload, FiEdit3, FiFileText, FiGrid, FiHome, FiImage,
  FiLayers, FiMap, FiMenu, FiMic, FiMoon, FiMove, FiPlus,
  FiRotateCw, FiSave, FiSearch, FiSettings, FiSun, FiTrash2,
  FiUpload, FiUsers, FiZap
} from 'react-icons/fi';
import api, { errMsg } from '../services/api';
import HouseScene from '../scenes/HouseScene.jsx';
import FloorPlanner from '../components/FloorPlanner.jsx';
import { TEMPLATES } from '../data/templates.js';
import { calcCost } from '../utils/costCalculator';
import { calcEnergy } from '../utils/energyCalculator';
import { calcSolar } from '../utils/solarCalculator';
import { captureAll, VIEWS } from '../utils/imageCapture';
import { buildReport } from '../utils/pdfGenerator';

const THEMES = {
  'Modern White': ['#f2f0ea', '#3a3f45'],
  'Luxury Black': ['#2a2a2e', '#111111'],
  'Warm Wood': ['#c9a77c', '#5a3d26'],
  'Minimal Grey': ['#bfc3c7', '#555555']
};

const starterRooms = (cfg) => [
  { id: 'living', name: 'Living Room', x: 0, y: 0, w: 20, l: 16, kind: 'common' },
  { id: 'kitchen', name: 'Kitchen', x: 20, y: 0, w: 14, l: 12, kind: 'wet' },
  { id: 'dining', name: 'Dining', x: 20, y: 12, w: 14, l: 10, kind: 'common' },
  { id: 'bath', name: 'Bathroom', x: 0, y: 16, w: 8, l: 8, kind: 'wet' },
  ...Array.from({ length: cfg.bedrooms || 0 }, (_, i) => ({
    id: `bed-${i + 1}`,
    name: `Bedroom ${i + 1}`,
    x: 8 + (i % 2) * 13,
    y: 16 + Math.floor(i / 2) * 12,
    w: 12,
    l: 10,
    kind: 'bed'
  }))
];

export default function Designer() {
  const { id } = useParams();
  const ref = useRef();
  const [p, setP] = useState({ projectName: 'Modern Family Home', ownerName: 'Rahul' });
  const [cfg, setCfg] = useState({ floors: 1, bedrooms: 3, bathrooms: 2, garage: true, garden: true, pool: true, style: 'Modern' });
  const [rooms, setRooms] = useState(() => starterRooms(cfg));
  const [prompt, setPrompt] = useState('Create a modern 3-bedroom house with 2 bathrooms, garage, garden and swimming pool.');
  const [mode, setMode] = useState('day');
  const [view, setView] = useState('3d');
  const [tpl, setTpl] = useState(null);
  const [theme, setTheme] = useState('Modern White');
  const [cps, setCps] = useState(1800);
  const [selectedRoom, setSelectedRoom] = useState('living');
  const [tool, setTool] = useState('select');
  const [query, setQuery] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  const toast = (t, ok = false) => {
    setMsg({ t, ok });
    window.setTimeout(() => setMsg(null), 3500);
  };

  useEffect(() => {
    api.get('/projects/' + id)
      .then(r => {
        const data = r.data || {};
        setP(data);
        if (data.designData?.config) setCfg(c => ({ ...c, ...data.designData.config }));
        if (Array.isArray(data.designData?.rooms) && data.designData.rooms.length) {
          setRooms(data.designData.rooms);
          setSelectedRoom(data.designData.rooms[0].id || 'living');
        }
      })
      .catch(e => toast(errMsg(e)));
  }, [id]);

  const area = +p.floorArea || 1500;
  const solar = useMemo(() => calcSolar({ roofArea: area / (cfg.floors || 1) }), [area, cfg.floors]);
  const cost = useMemo(() => calcCost({ area, costPerSqFt: cps, pool: cfg.pool, garden: cfg.garden, solarKw: solar.capacityKw }), [area, cps, cfg.pool, cfg.garden, solar.capacityKw]);
  const energy = useMemo(() => calcEnergy({ area, floors: cfg.floors, solarKw: solar.capacityKw }), [area, cfg.floors, solar.capacityKw]);

  const plot = tpl ? TEMPLATES[tpl].plot : [34, 28];
  const selected = rooms.find(r => r.id === selectedRoom) || rooms[0];
  const filteredFurniture = ['Sofa', 'Bed', 'Table', 'Chair', 'Kitchen', 'Wardrobe', 'Toilet', 'Plant']
    .filter(x => x.toLowerCase().includes(query.toLowerCase()));

  const pick = k => {
    const t = TEMPLATES[k];
    setTpl(k);
    setCfg(t.cfg);
    const nextRooms = t.rooms.map((r, i) => ({ ...r, id: r.id || `${k}-${i}` }));
    setRooms(nextRooms);
    setSelectedRoom(nextRooms[0]?.id || 'living');
    setP(x => ({ ...x, floors: 1, bedrooms: t.cfg.bedrooms, bathrooms: t.cfg.bathrooms, floorArea: t.floorArea, plotWidth: t.plot[0], plotLength: t.plot[1] }));
    toast(`${t.label} layout applied`, true);
  };

  const gen = async () => {
    try {
      const { data } = await api.post('/ai/generate-house', { prompt });
      setCfg(data.config);
      setRooms(starterRooms(data.config));
      setSelectedRoom('living');
      setP(x => ({ ...x, floors: data.config.floors, bedrooms: data.config.bedrooms, bathrooms: data.config.bathrooms, style: data.config.style }));
      toast('AI house generated', true);
    } catch (e) {
      toast(errMsg(e));
    }
  };

  const save = async (extra = {}) => {
    const body = {
      ...p,
      ...extra,
      designData: { config: cfg, template: tpl, rooms, theme, mode, cost, energy, solar }
    };
    const { data } = await api.put('/projects/' + id, body);
    setP(data);
    return data;
  };

  const finish = async () => {
    if (!p.projectName) return toast('Add a project name first');
    setBusy(true);
    try {
      setView('3d');
      await new Promise(r => setTimeout(r, 350));
      await save();
      const images = await captureAll(ref.current);
      const pdf = buildReport({ project: { ...p, floors: cfg.floors, bedrooms: cfg.bedrooms, bathrooms: cfg.bathrooms }, images, cost, energy, solar, config: { ...cfg, rooms } });
      await save({ status: 'completed' });
      setDone({ images, pdf });
      toast('Design completed', true);
    } catch (e) {
      toast('Report failed: ' + errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const updateSelected = (key, value) => {
    setRooms(rs => rs.map(r => r.id === selectedRoom ? { ...r, [key]: value } : r));
  };

  const addFurniture = name => toast(`${name} selected — furniture placement is ready for GLB/GLTF integration.`, true);
  const dl = (u, n) => { const a = document.createElement('a'); a.href = u; a.download = n; a.click(); };

  return (
    <div className="designerStudio">
      {msg && <div className={'toast ' + (msg.ok ? 'ok' : '')}>{msg.t}</div>}

      <header className="dsHeader">
        <div className="brandLockup">
          <div className="brandMark"><FiHome /></div>
          <div><strong>DreamHome3D</strong><small>Design · Plan · Build · Your Dream Home</small></div>
        </div>
        <div className="headerProject">
          <FiHome />
          <input value={p.projectName || ''} onChange={e => setP({ ...p, projectName: e.target.value })} />
          <FiEdit3 />
        </div>
        <div className="headerActions">
          <button onClick={() => setMode(mode === 'night' ? 'day' : 'night')} title="Day / night"><FiMoon /><FiSun /></button>
          <button onClick={() => setTool('voice')} className={tool === 'voice' ? 'active' : ''}><FiMic /></button>
          <button onClick={() => save().then(() => toast('Project saved', true)).catch(e => toast(errMsg(e)))}><FiSave /> Save</button>
          <button className="primary" onClick={finish} disabled={busy}><FiFileText /> {busy ? 'Generating…' : 'Generate PDF'}</button>
          <button className="profile"><span className="avatar">R</span><span>{p.ownerName || 'Rahul'}</span><FiChevronDown /></button>
        </div>
      </header>

      <button className="mobileMenuButton" onClick={() => setMobileMenu(!mobileMenu)}><FiMenu /></button>

      <div className="dsBody">
        <aside className={'dsSidebar ' + (mobileMenu ? 'open' : '')}>
          <nav>
            <a href="#dashboard"><FiGrid /> Dashboard</a>
            <a className="active" href="#designer"><FiBox /> 3D Designer</a>
            <button onClick={() => setView('2d')}><FiMap /> 2D Planner</button>
            <button onClick={() => setTool('ai')}><FiZap /> AI Assistant</button>
            <button onClick={() => toast(`Cost estimate: ₹${Math.round(cost.total).toLocaleString('en-IN')}`, true)}><FiZap /> Cost & Energy</button>
            <button onClick={() => toast(`Solar suggestion: ${solar.capacityKw} kW`, true)}><FiSun /> Solar Planner</button>
            <button onClick={finish}><FiFileText /> PDF Report</button>
            <a href="#projects"><FiLayers /> Projects</a>
            <a href="#profile"><FiUsers /> Profile</a>
          </nav>
          <div className="sidebarPromo">
            <div className="promoHouse">🏡</div>
            <h3>Turn Your Ideas<br />Into Reality</h3>
            <p>AI powered home design with 3D visualization</p>
            <button onClick={gen}>Get Started <span>→</span></button>
          </div>
        </aside>

        <main className="dsMain">
          <div className="studioToolbar">
            <div className="viewTabs">
              <button className={view === '3d' ? 'active' : ''} onClick={() => setView('3d')}>3D View</button>
              <button className={view === '2d' ? 'active' : ''} onClick={() => setView('2d')}>2D Plan</button>
            </div>
            <div className="toolButtons">
              {['select', 'move', 'rotate', 'zoom', 'layers'].map((x, i) => {
                const I = [FiCircle, FiMove, FiRotateCw, FiSearch, FiLayers][i];
                return <button key={x} className={tool === x ? 'active' : ''} onClick={() => setTool(x)} title={x}><I /></button>;
              })}
            </div>
            <div className="topStats"><span><FiHome /> {Math.round(area).toLocaleString()} sq ft</span><span><FiClock /> {cfg.floors} floor</span></div>
          </div>

          <section className="dsViewport">
            {view === '3d' ? (
              <HouseScene ref={ref} config={cfg} mode={mode} wall={THEMES[theme][0]} roof={THEMES[theme][1]} />
            ) : (
              <FloorPlanner rooms={rooms} plot={plot} />
            )}
            <div className="compass"><span>N</span><b>▲</b><span>E</span><span>S</span><span>W</span></div>
            <div className="viewportHint"><FiMove /> Drag to orbit <span>•</span> Scroll to zoom</div>
            {tool === 'ai' && <div className="floatingAi"><FiZap /><div><strong>AI Assistant</strong><p>{prompt}</p></div><button onClick={gen}>Generate</button></div>}
          </section>

          <div className="metricBar">
            <div><FiHome /><span>Total Area<strong>{Math.round(area).toLocaleString()} sq ft</strong></span></div>
            <div><FiCircle /><span>Cost Estimate<strong>₹{Math.round(cost.total).toLocaleString('en-IN')}</strong></span></div>
            <div><FiZap /><span>Monthly Energy<strong>{energy.monthlyKwh || energy.monthly || 320} kWh</strong></span></div>
            <div><FiSun /><span>Solar Suggestion<strong>{solar.capacityKw} kW</strong></span></div>
          </div>
        </main>

        <aside className="dsProperties">
          <div className="propertyHeader"><h2>Properties</h2><button><FiSettings /></button></div>
          <div className="selectedCard">
            <div className="selectedThumb">🏠</div>
            <div><strong>{selected?.name || 'Living Room'}</strong><small>{selected ? `${selected.w || 12} ft × ${selected.l || 14} ft` : '12 ft × 14 ft'}</small></div>
            <FiEdit3 />
          </div>

          <label>Room Name<input value={selected?.name || ''} onChange={e => updateSelected('name', e.target.value)} /></label>
          <div className="twoFields"><label>Width (ft)<input type="number" value={selected?.w || 12} onChange={e => updateSelected('w', +e.target.value)} /></label><label>Depth (ft)<input type="number" value={selected?.l || 14} onChange={e => updateSelected('l', +e.target.value)} /></label></div>

          <div className="sectionTitle">Room Style</div>
          <div className="styleGrid">
            {['Modern', 'Classic', 'Minimal'].map(s => <button key={s} className={p.style === s ? 'chosen' : ''} onClick={() => setP({ ...p, style: s })}><span>{s === 'Modern' ? '▦' : s === 'Classic' ? '◈' : '□'}</span>{s}</button>)}
          </div>

          <div className="sectionTitle">Color Theme</div>
          <div className="colorDots">
            {Object.entries(THEMES).map(([name, colors]) => <button key={name} title={name} className={theme === name ? 'chosen' : ''} style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }} onClick={() => setTheme(name)} />)}
          </div>

          <div className="smartSuggestion"><FiZap /><div><strong>Smart Suggestion</strong><p>Keep the living room open and well lit. Add plants for better air quality and positive vibes.</p></div></div>

          <div className="sectionTitle furnitureTitle">Furniture & Objects</div>
          <div className="searchBox"><FiSearch /><input placeholder="Search objects" value={query} onChange={e => setQuery(e.target.value)} /></div>
          <div className="furnitureGrid">
            {filteredFurniture.map(name => <button key={name} onClick={() => addFurniture(name)}><span>{({ Sofa: '🛋️', Bed: '🛏️', Table: '🪵', Chair: '🪑', Kitchen: '🍳', Wardrobe: '🗄️', Toilet: '🚽', Plant: '🌿' })[name]}</span><small>{name}</small></button>)}
          </div>

          <div className="propertyActions">
            <button onClick={() => toast('Room duplicated', true)}><FiCopy /> Duplicate</button>
            <button onClick={() => setRooms(rs => rs.filter(r => r.id !== selectedRoom))}><FiTrash2 /> Delete</button>
          </div>

          <div className="advancedPanel">
            <div className="sectionTitle">AI House Generator</div>
            <textarea rows="3" value={prompt} onChange={e => setPrompt(e.target.value)} />
            <button className="primary full" onClick={gen}><FiZap /> Generate House</button>
          </div>

          {done && <div className="downloadCard"><strong>Design completed</strong><button className="primary full" onClick={() => done.pdf.save('DreamHome3D-Report.pdf')}><FiDownload /> Download PDF</button>{Object.entries(done.images).map(([k, u]) => <button className="linkBtn" key={k} onClick={() => dl(u, k + '.jpg')}><FiImage /> Download {k}.jpg</button>)}</div>}
        </aside>
      </div>
    </div>
  );
}
