import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard'
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi"

export default function AllContainer ({ query, filter }) {

  const [allCourses, setAllCourses] = useState([]);
  const [sortedCourses, setSortedCourses] = useState([]);
  const [isAscending, setIsAscending] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const response = await fetch(`/course`);
    const data = await response.json();
    setAllCourses(data);
  };

  useEffect(() => {
    sortCourses();
  }, [allCourses, isAscending]);

  const sortCourses = () => {
    const sorted = [...allCourses].sort((a, b) => {
      return isAscending
        ? a.average_rating - b.average_rating
        : b.average_rating - a.average_rating;
    });
    setSortedCourses(sorted);
  };

  const handleSort = () => {
    setIsAscending(!isAscending);
  };

  let filteredItems = filter === "All" ? sortedCourses : sortedCourses.filter((el) => el.category === filter);

  let all_course = filteredItems

    .filter((course) => course.title.toLowerCase().includes(query.toLowerCase()))
    .map((course) => (<CourseCard key={course.id} {...course}/>));

  return (
    <>
      <div className="w-4/5 my-6">
        <div className="flex justify-between">
            <div>
                <h2 className='text-black font-bold md:text-2xl pt-4 pl-4 '>Best courses</h2>
                <h2 className='text-black  md:text-xl pl-4 pb-2'>All list of courses</h2>
            </div>
            <div className="flex place-items-end mb-2">
                <p className='mr-2 text-xl'>Sort by rating:</p>
            <button onClick={handleSort} className=" hover:bg-blue-300 font-bold text-sm rounded-full">
            {isAscending ? <HiArrowSmUp/> : <HiArrowSmDown/>}
            </button>
            </div>
        </div>
        
        <div className="grid grid-cols-5 gap-8 px-4">
          
          {all_course}
        </div>
      </div>
    </>
  );
}