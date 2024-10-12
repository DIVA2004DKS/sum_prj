import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';
import Login from './components/Login/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <div style={{ display: 'flex', height: '100vh', width: '1000vw' }}>
              <Sidebar />
              <Main />
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
