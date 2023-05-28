import React, { useState, useEffect, useContext } from 'react';
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
      <div className="flex mx-auto pt-6 flex-col">
        <div className="flex mx-auto justify-start max-w-[1240px] ">

          <h2 className="p-4 font-bold text-4xl">My learning</h2>
        </div>
        <div className="max-w-[1240px] mx-auto pb-12 grid md:grid-cols-4 gap-6">
          {all_course}
        </div>
      </div>
    );

}

            