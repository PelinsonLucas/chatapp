import './App.css';
import React from 'react';
import ChatApp from './ChatApp';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Invite from './Components/Invite/Invite.jsx';

const App = () => {

  return (
  <HashRouter>
    <Routes >
      <Route exact path="/" element={<ChatApp/>}/> 
      <Route path="/join/:roomID" element={<Invite/>}/>
    </Routes>
  </HashRouter>
  );
}

export default App;
