import React, { useState, useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import CourseContainer from "./components/CourseContainer";
import Navbar from "./components/Navbar";
import UserProfile from "./components/UserProfile";
import CreateCourseForm from "./components/CreateCourseForm";
import CreateLesson from "./components/CreateLesson";
import Settings from "./components/Settings";
import MyLearning from "./components/MyLearning";
import LearningPage from "./components/LearningPage";
import { UserContext } from "./UserContext";
import { CourseContext } from "./CourseContext";
import { CourseDetail } from "./components/CourseDetail";
import CoursesControl from "./components/CoursesControl";
import Footer from "./components/Footer/Footer";
import { EditDetail } from "./components/EditDetail";

function App() {
  const [userId, setUserId] = useState(null);
  const [course, setCourse] = useState(null);
  const [query, setQuery] = useState('')


  const valueUser = useMemo(() => ({ userId, setUserId }), [userId, setUserId]);
  const valueCourse = useMemo(() => ({ course, setCourse }), [course, setCourse]);

 

  return (
   
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
        <Navbar userId={userId} setQuery={setQuery}/>
      
        <CourseContext.Provider value={valueCourse}>
          <UserContext.Provider value={valueUser}>
            <Routes>
              <Route path="/" element={<CourseContainer query={query}/>} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/create_course" element={<CreateCourseForm />} />
              <Route path="/create_lesson" element={<CreateLesson />} />
              <Route path="/detail/:id" element={<CourseDetail />} />
              <Route path="/edit/:id" element={<EditDetail/>} />

              <Route path="/settings" element={<Settings />} />
              <Route path="/my_learning" element={<MyLearning />} />
              <Route path="/instructor_courses" element={<CoursesControl />} />
              
              <Route path="/learning_process/:id" element={<LearningPage />} />
            </Routes>
          </UserContext.Provider>
        </CourseContext.Provider>
        </main>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
