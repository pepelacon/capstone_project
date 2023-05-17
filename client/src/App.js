import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
import CourseContainer from './components/CourseContainer';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
// import SignUp from './components/SignUp';
// import SignOut from './components/SignOut';

function App() {
    const [userId, setUserId] = useState()

  return (
    <main>
        <Navbar />
        <Routes>
            <Route path="/profile" element={<UserProfile />}/>
            <Route path="/" element={<CourseContainer />} />
        </Routes>
    </main>
  );
}

export default App;
