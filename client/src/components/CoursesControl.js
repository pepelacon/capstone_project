import React, { useState, useEffect, useContext } from 'react';
import CourseCard from './CourseCard'
import { UserContext } from '../UserContext'
import { useNavigate } from 'react-router-dom';





export default function CoursesControl () {
    const [allCourses, setAllCourses] = useState([])
    const { userId } = useContext(UserContext) 
    const navigate = useNavigate()


    const fetchCourses = async () => {
        const response = await fetch(`/my_courses/${userId.id}`);
        const data = await response.json();
        setAllCourses(data);
      };
    useEffect(()=>{
        fetchCourses();
    },[]);
    console.log(allCourses);
    let all_course = allCourses.map((course) => (<CourseCard key={course.id} {...course}/>))
    
    return (
        <>
            { allCourses.length === 0 ? (
                
                <div className="flex justify-center items-center h-screen">
                    <div className="max-w-[1240px] mx-auto text-center h-64">
                        <p>You don't have any courses.</p>
                        <button onClick={() => navigate('/create_course')}>Create one</button>
                    </div>
                </div>
            ) : (
                
                    <div className="flex justify-center items-center">
                    <div className="mt-16 w-4/5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 pt-4">    
                        {all_course}
                    </div>
                    </div>
                )}
        </>
    )
}