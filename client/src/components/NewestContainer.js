import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from './CourseCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


export default function NewestContainer() {
  const navigate = useNavigate();
  const [newestCourses, setNewestCourses] = useState([]);
   
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`/course/newest`);
      const data = await response.json();
      setNewestCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCourseClick = (id) => {
    navigate(`/detail/${id}`);
  };

  let newest_courses = newestCourses.map((course) => (
    <div className="mx-4" key={course.id}>
      <CourseCard {...course} onClick={() => handleCourseClick(course.id)} />
    </div>
  ));

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };


  return (
      <div className="w-4/5  ">
        <h2 className='text-black font-bold md:text-2xl pt-4 pl-4'>What to learn next</h2>
        <h2 className='text-black  md:text-xl pl-4 pb-2'>Newest courses </h2>

        <Carousel 
            responsive={responsive}
            infinite={true}
        
        >
            {newest_courses}
        </Carousel>
      </div>
  );
}