import React, { useState, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import CourseContainer from './components/CourseContainer';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
import CreateCourseForm from './components/CreateCourseForm';
import { UserContext } from './UserContext';
import { CourseDetail } from './components/CourseDetail';


function App() {
    const [userId, setUserId] = useState(null)
    const value = useMemo(() => ({ userId, setUserId }), [userId, setUserId])

    console.log(userId);
    return (
        <main>
            <Navbar />
            <UserContext.Provider value={ value }>
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
