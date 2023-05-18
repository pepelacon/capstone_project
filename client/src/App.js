import React, { useState, useMemo, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import CourseContainer from './components/CourseContainer';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
import CreateCourseForm from './components/CreateCourseForm';
import { UserContext } from './UserContext';
import { CourseDetail } from './components/CourseDetail';


function App() {
    const [userId, setUserId] = useState(null)
    
    const valueUser = useMemo(() => ({ userId, setUserId }), [userId, setUserId])
    

    return (
        <main>
            <Navbar />
            <UserContext.Provider value={ valueUser }>
                <Routes>
                    <Route path="/" element={<CourseContainer />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/create_course" element={<CreateCourseForm />} />
                    <Route path="/detail/:id" element={<CourseDetail />} />
                </Routes>
            </UserContext.Provider>
        </main>
    );
}

export default App;
