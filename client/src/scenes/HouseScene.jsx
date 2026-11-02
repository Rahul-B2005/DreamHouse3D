import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Sky } from '@react-three/drei';

const Mat = ({ c, r = .7, m = 0, ...p }) => <meshStandardMaterial color={c} roughness={r} metalness={m} {...p} />;
const Box = ({ p, s, c, r, m, o = 1, ...x }) => <mesh position={p} castShadow receiveShadow {...x}><boxGeometry args={s} /><Mat c={c} r={r} m={m} transparent={o < 1} opacity={o} /></mesh>;

function Rig({ apiRef }) {
  const { camera, gl } = useThree();
  useImperativeHandle(apiRef, () => ({
    setView: p => { camera.position.set(...p); camera.lookAt(0, 1.5, 0); },
    canvas: () => gl.domElement
  }));
  return null;
}

function Window({ p, rot = [0, 0, 0] }) {
  return <group position={p} rotation={rot}>
    <Box p={[0, 0, 0]} s={[2.4, 1.7, .08]} c="#8ac7e5" r={.08} m={.15} o={.72} />
    <Box p={[-1.15, 0, -.06]} s={[.08, 1.8, .1]} c="#4b5964" r={.45} />
    <Box p={[1.15, 0, -.06]} s={[.08, 1.8, .1]} c="#4b5964" r={.45} />
    <Box p={[0, 0, -.06]} s={[.08, 1.7, .1]} c="#4b5964" r={.45} />
  </group>;
}

function Sofa({ p }) {
  return <group position={p}>
    <Box p={[0, .48, 0]} s={[3.8, .65, 1.25]} c="#d7d5cf" r={.9} />
    <Box p={[0, 1.05, .48]} s={[3.8, 1.05, .25]} c="#c8c5be" r={.9} />
    <Box p={[-1.75, 1, 0]} s={[.3, 1.05, 1.25]} c="#c8c5be" r={.9} />
    <Box p={[1.75, 1, 0]} s={[.3, 1.05, 1.25]} c="#c8c5be" r={.9} />
    <Box p={[0, .45, -1.25]} s={[1.9, .15, .85]} c="#6d4d35" r={.65} />
  </group>;
}

function Bed({ p }) {
  return <group position={p}>
    <Box p={[0, .55, 0]} s={[3.5, .35, 4.2]} c="#7b5234" r={.65} />
    <Box p={[0, .82, .05]} s={[3.2, .42, 3.75]} c="#eee9df" r={.98} />
    <Box p={[0, 1.65, -1.88]} s={[3.5, 2.2, .25]} c="#6e4931" r={.7} />
    <Box p={[-.8, 1.08, -1.1]} s={[1.05, .25, .7]} c="#c8d2d8" r={.95} />
    <Box p={[.8, 1.08, -1.1]} s={[1.05, .25, .7]} c="#c8d2d8" r={.95} />
  </group>;
}

function Table({ p }) {
  return <group position={p}>
    <Box p={[0, .95, 0]} s={[3.2, .18, 1.65]} c="#805535" r={.65} />
    {[-1.25, 1.25].flatMap(x => [-.55, .55].map(z => <Box key={`${x}-${z}`} p={[x, .48, z]} s={[.16, .9, .16]} c="#5b3a27" r={.7} />))}
    {[-2.1, 2.1].map(x => <Box key={x} p={[x, .5, 0]} s={[.7, .9, 1]} c="#6f777b" r={.9} />)}
  </group>;
}

function Kitchen({ p }) {
  return <group position={p}>
    <Box p={[0, .7, 0]} s={[5.3, 1.1, .8]} c="#e6e4dd" r={.4} />
    <Box p={[0, 1.3, 0]} s={[5.45, .16, .88]} c="#333a3f" r={.3} m={.15} />
    {[-2, -1, 0, 1, 2].map(x => <Box key={x} p={[x, .72, -.43]} s={[.85, .8, .05]} c="#c9c7c1" r={.5} />)}
  </group>;
}

function Plant({ p, s = 1 }) {
  return <group position={p} scale={s}>
    <Box p={[0, .3, 0]} s={[.45, .6, .45]} c="#b77a45" r={.8} />
    <mesh position={[0, 1.05, 0]} castShadow><icosahedronGeometry args={[.75, 1]} /><Mat c="#4e8a57" r={1} /></mesh>
  </group>;
}

function Tree({ p, s = 1 }) {
  return <group position={p} scale={s}>
    <Box p={[0, 1.2, 0]} s={[.35, 2.4, .35]} c="#65462f" r={1} />
    <mesh position={[0, 3, 0]} castShadow><icosahedronGeometry args={[1.35, 1]} /><Mat c="#3d7d49" r={1} /></mesh>
  </group>;
}

function Pool({ p }) {
  return <group position={p}>
    <Box p={[0, .04, 0]} s={[7.2, .08, 4.5]} c="#d0cbc1" r={.9} />
    <Box p={[0, .11, 0]} s={[6.55, .1, 3.85]} c="#27a8d0" r={.06} m={.15} o={.9} />
  </group>;
}

function Car({ p }) {
  return <group position={p}>
    <Box p={[0, .55, 0]} s={[4.2, .65, 1.9]} c="#f2f3f4" r={.28} m={.25} />
    <Box p={[0, 1.05, 0]} s={[2.25, .65, 1.55]} c="#263f50" r={.12} m={.15} o={.82} />
    {[-1.35, 1.35].flatMap(x => [-.88, .88].map(z => <mesh key={`${x}-${z}`} position={[x, .25, z]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[.35, .35, .2, 24]} /><Mat c="#151719" r={.85} /></mesh>))}
  </group>;
}

function Room({ x, z, w, d, name, type, wall }) {
  const floor = type === 'bed' ? '#b48c69' : type === 'wet' ? '#a7b6b9' : '#c7a77f';
  return <group position={[x, 0, z]}>
    <Box p={[0, .05, 0]} s={[w, .1, d]} c={floor} r={.92} />
    <Box p={[0, 1.45, -d / 2]} s={[w, 2.9, .16]} c={wall} r={.8} />
    <Box p={[-w / 2, 1.45, 0]} s={[.16, 2.9, d]} c={wall} r={.8} />
    <Box p={[w / 2, 1.45, 0]} s={[.16, 2.9, d]} c={wall} r={.8} />
    <Box p={[0, 1.45, d / 2]} s={[w, 2.9, .16]} c={wall} r={.8} />
    <Box p={[0, 3.02, 0]} s={[w + .25, .12, d + .25]} c="#ded9ce" r={.9} />
    {type === 'living' && <><Sofa p={[0, 0, .7]} /><Plant p={[-w / 2 + 1, 0, -d / 2 + 1]} s={.75} /></>}
    {type === 'bed' && <><Bed p={[0, 0, 0]} /><Plant p={[w / 2 - 1, 0, d / 2 - 1]} s={.7} /></>}
    {type === 'kitchen' && <Kitchen p={[0, 0, -1]} />}
    {type === 'dining' && <Table p={[0, 0, 0]} />}
    {type === 'bath' && <><Box p={[0, .35, 0]} s={[1.8, .7, 2]} c="#f0eee9" r={.65} /><Box p={[1.8, .4, 1]} s={[.9, .8, .9]} c="#f5f5f2" r={.7} /></>}
    <Window p={[0, 1.65, -d / 2 - .1]} />
    <mesh position={[0, 3.12, 0]}>
      <boxGeometry args={[w, .03, d]} />
      <meshStandardMaterial color="#e5e0d6" roughness={1} transparent opacity={.98} />
    </mesh>
  </group>;
}

function House({ cfg, wall, night }) {
  const floors = cfg.floors || 1;
  const rooms = [
    { x: -2.5, z: 0, w: 10, d: 8, name: 'Living Room', type: 'living' },
    { x: 7.5, z: 0, w: 8, d: 8, name: 'Kitchen', type: 'kitchen' },
    { x: 7.5, z: 6.5, w: 8, d: 5, name: 'Dining', type: 'dining' },
    { x: -7, z: 6.5, w: 5, d: 5, name: 'Bathroom', type: 'bath' },
    { x: 1.5, z: 8.5, w: 7, d: 6, name: 'Bedroom', type: 'bed' }
  ];
  return <group>
    {Array.from({ length: floors }).map((_, floor) => <group key={floor} position={[0, floor * 3.4, 0]}>
      {rooms.map(r => <Room key={r.name} {...r} wall={wall} />)}
    </group>)}
    <Box p={[0, floors * 3.4 + .1, 0]} s={[18, .22, 17]} c="#59646e" r={.55} m={.1} />
    {cfg.pool && <Pool p={[-13, 0, 7]} />}
    {cfg.garage && <><Box p={[14, .05, -3]} s={[7, .1, 10]} c="#777" r={1} /><Car p={[14, .05, -3]} /></>}
    {cfg.garden && [[-17, 0, -11], [18, 0, -10], [-18, 0, 12], [17, 0, 12], [-10, 0, -12], [8, 0, 13]].map((p, i) => <Tree key={i} p={p} s={.8 + (i % 3) * .15} />)}
    <Box p={[0, .05, -13]} s={[5, .1, 8]} c="#4d5255" r={1} />
    {night && <pointLight position={[0, 4, 0]} intensity={18} color="#ffd38a" distance={22} />}
    {night && <pointLight position={[-13, 1, 7]} intensity={7} color="#42cfff" distance={10} />}
  </group>;
}

export default forwardRef(function HouseScene({ config, mode = 'day', wall = '#f2f0ea', roof = '#3a3f45' }, ref) {
  const night = mode === 'night';
  const evening = mode === 'evening';
  const sun = useMemo(() => night ? .08 : evening ? .7 : 1.8, [mode]);
  return <Canvas shadows gl={{ preserveDrawingBuffer: true }} camera={{ position: [28, 25, 30], fov: 42 }} style={{ background: night ? '#07111e' : '#b8cedd' }}>
    <Rig apiRef={ref} />
    <ambientLight intensity={night ? .22 : .65} />
    <directionalLight castShadow position={evening ? [-20, 12, 10] : [15, 28, 12]} intensity={sun} color={evening ? '#ffc078' : '#fff'} shadow-mapSize={[2048, 2048]} />
    {!night && <Sky sunPosition={evening ? [-20, 5, 10] : [10, 20, 10]} />}
    <Environment preset={night ? 'night' : evening ? 'sunset' : 'city'} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[80, 80]} /><Mat c={night ? '#18301f' : '#628b55'} r={1} /></mesh>
    <House cfg={config} wall={wall} roof={roof} night={night} />
    <OrbitControls target={[0, 2, 0]} enableDamping dampingFactor={.08} minDistance={8} maxDistance={80} maxPolarAngle={Math.PI / 2.02} />
  </Canvas>;
});
