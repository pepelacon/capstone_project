import React, { useState, useEffect, useContext } from 'react';
import CourseCard from './CourseCard'
import YourLearningCard from './YourLearningCard'
import { UserContext } from '../UserContext'



export default function MyLearning () {
    const { userId } = useContext(UserContext) 
    const [allLearning, setAllLearning] = useState([])
   
    const fetchCourses = async () => {
        const response = await fetch(`/my_learning/${userId.id}`);
        const data = await response.json();
        setAllLearning(data);
      };
    useEffect(()=>{
        fetchCourses();
    },[]);
    console.log(allLearning);
    let all_course = allLearning.map((course) => (<YourLearningCard key={course.id} {...course}/>))
    
    return (
        <div className='max-w-[1640px] mx-auto p-4 py-12 grid md:grid-cols-4 gap-6'>    
          {all_course}
        </div>
    )

}