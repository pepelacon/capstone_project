import React, { useState, useEffect } from 'react';
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
        <div id='profile-page'>       
            {all_course}
        </div>
    )

}