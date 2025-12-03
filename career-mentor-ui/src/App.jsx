import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import './App.css';

function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> {/* This is where your page components will be rendered */}
      </main>
    </div>
  );
}

export default App;