import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard'




export default function CourseContainer ({query}) {
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
    console.log(query);
    let all_course = allCourses.filter((course) => course.title.toLowerCase().includes(query)
    ).map((course) => (<CourseCard key={course.id} {...course}/>))
    
    return (
        <div className="flex justify-center items-center">
            <div className="mt-16 w-4/5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 pt-4">    
                {all_course}
            </div>
        </div>

    )

}