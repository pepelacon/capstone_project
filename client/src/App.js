import React, { useState, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import CourseContainer from './components/CourseContainer';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
import CreateCourseForm from './components/CreateCourseForm';
import CreateLesson from './components/CreateLesson';
import Settings from './components/Settings';
import MyLearning from './components/MyLearning';
import LearningPage from './components/LearningPage';
import { UserContext } from './UserContext';
import { CourseContext } from './CourseContext';
import { CourseDetail } from './components/CourseDetail';


function App() {
    const [userId, setUserId] = useState(null)
    const [course, setCourse] = useState(null)
    
    
    const valueUser = useMemo(() => ({ userId, setUserId }), [userId, setUserId])
    const valueCourse = useMemo(() => ({ course, setCourse }), [course, setCourse])
 

    

    return (
        <main>
            <Navbar />
                <CourseContext.Provider value={ valueCourse }>
                    <UserContext.Provider value={ valueUser }>
                        <Routes>
                            <Route path="/" element={<CourseContainer />} />
                            <Route path="/profile" element={<UserProfile />} />
                            <Route path="/create_course" element={<CreateCourseForm />} />
                            <Route path="/create_lesson" element={<CreateLesson />} />
                            <Route path="/detail/:id" element={<CourseDetail />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/my_learning" element={<MyLearning />} />
                            <Route path="/learning_process/:id" element={<LearningPage />} />
                        </Routes>
                    </UserContext.Provider>
                </CourseContext.Provider>
        </main>
    );
}

export default App;
