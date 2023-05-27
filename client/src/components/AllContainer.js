import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard'





export default function AllContainer ({query}) {
    const [allCourses, setAllCourses] = useState([])
    console.log(allCourses);
    const fetchCourses = async () => {
        const response = await fetch(`/course`);
        const data = await response.json();
        setAllCourses(data);
      };
    useEffect(()=>{
        fetchCourses();
    },[]);
    
    let all_course = allCourses.filter((course) => course.title.toLowerCase().includes(query.toLowerCase())
    ).map((course) => (<CourseCard key={course.id} {...course}/>))
    
    return (
       
            
            <div className="mt-16 w-4/5 grid grid-cols-5 gap-8 pt-4 px-4">    
                {all_course}
            </div>

    )

}