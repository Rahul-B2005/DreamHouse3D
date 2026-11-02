import React from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Designer from './pages/Designer.jsx';
import Showcase from './pages/Showcase.jsx';

const Guard = ({ children }) => localStorage.getItem('token') ? children : <Navigate to="/login" />;

export default function App() {
  const nav = useNavigate();
  const location = useLocation();
  const out = () => { localStorage.clear(); nav('/'); };
  const isDesigner = location.pathname.startsWith('/designer/');

  return <>
    {!isDesigner && <div className="nav">
      <Link to="/"><b>DreamHome3D</b></Link>
      <span>
        {localStorage.getItem('token') ? <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/tools">Design tools</Link>
          <button className="btn ghost" onClick={out}>Log out</button>
        </> : <Link to="/login">Log in</Link>}
      </span>
    </div>}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
      <Route path="/tools" element={<Guard><Showcase /></Guard>} />
      <Route path="/designer/:id" element={<Guard><Designer /></Guard>} />
    </Routes>
  </>;
}
