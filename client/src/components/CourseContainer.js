import React, { useState, useEffect, useContext } from 'react';
import CourseCard from './CourseCard'




export default function CourseContainer () {
    const [allCourses, setAllCourses] = useState([])

    const fetchCourses = async () => {
        const response = await fetch(`/course`);
        const data = await response.json();
        setAllCourses(data);
      };
    useEffect(()=>{
        fetchCourses();
    },[]);

    let all_course = allCourses.map((course) => (<CourseCard key={course.id} {...course}/>))
    
    return (
        <div className="mt-16 grid grid-cols-4 gap-4 justify-center">    
            {all_course}
        </div>
    )

}