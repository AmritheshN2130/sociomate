import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './pages/Start';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Notifications from "./pages/notifications";
import Community from './pages/Community';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
     <Route path="/" element={<Start />} />
  <Route path="/login" element={<Login />} />    ✅ this should exist
  <Route path="/signup" element={<Signup />} />
  <Route path="/home" element={<Home />} />
  <Route path="/upload" element={<Upload />} />
  <Route path="/profile" element={<Profile />} />
<Route path="/notifications" element={<Notifications />} />
 <Route path="/community" element={<Community />} />

    </Routes>
  </BrowserRouter>
);
