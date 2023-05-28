import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard'


export default function AllContainer ({query, filter}) {
    const [allCourses, setAllCourses] = useState([])
    
    const fetchCourses = async () => {
        const response = await fetch(`/course`);
        const data = await response.json();
        setAllCourses(data);
      };
    useEffect(()=>{
        fetchCourses();
    },[]);
   
    let filteredItems = filter === "All" ? allCourses : allCourses.filter((el) => el.category === filter);
    

    let all_course = filteredItems.filter((course) => course.title.toLowerCase().includes(query.toLowerCase())
    ).map((course) => (<CourseCard key={course.id} {...course}/>))
    
    return (
         <>
            <div className=" w-4/5 my-6">    
                <h2  className='text-black font-bold md:text-2xl pt-4 pl-4 '>Best courses</h2>
                <h2 className='text-black  md:text-xl pl-4 pb-2'>All list of courses</h2>


                <div className="  grid grid-cols-5 gap-8 px-4">    

                    {all_course}
                </div>
            </div>
         </>   
    )
}