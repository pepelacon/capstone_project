import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from './CourseCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
// import './BestContainer.css'

export default function BestContainer() {
  const navigate = useNavigate();
  const [bestCourses, setBestCourses] = useState([]);
    console.log(bestCourses);
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`/course/best`);
      const data = await response.json();
      setBestCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCourseClick = (id) => {
    navigate(`/detail/${id}`);
  };

  let best_courses = bestCourses.map((course) => (
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
        <h2 className='text-black font-bold md:text-xl p-4'>Best offers</h2>
        <Carousel 
            responsive={responsive}
            infinite={true}
        >
            {best_courses}
        </Carousel>
      </div>
  );
}