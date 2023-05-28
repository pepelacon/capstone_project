import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from './CourseCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import {FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function BestContainer() {
  const navigate = useNavigate();
  const [bestCourses, setBestCourses] = useState([]);
    
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

  const CustomLeftArrow= ({ onClick, ...rest }) => {
    const {
      onMove,
      carouselState: { currentSlide, deviceType }
    } = rest;
    // onMove means if dragging or swiping in progress.
    return (
      <button onClick={() => onClick()} className="bg-black text-white rounded-full p-2">
        <FiChevronLeft size={30} />
      </button>
      )
  };

  const CustomRightArrow = ({ onClick, ...rest }) => {
    const {
      onMove,
      carouselState: { currentSlide, deviceType }
    } = rest;
    // onMove means if dragging or swiping in progress.
    return (
      <button onClick={() => onClick()} className="bg-black text-white rounded-full p-2">
        <FiChevronRight size={24} />
      </button>
      )
  };

  return (
      <div className="w-4/5  ">
        <h2 className='text-black font-bold md:text-2xl pt-4 pl-4'>Best rated</h2>
        <h2 className='text-black  md:text-xl pl-4 pb-2'>Best course in each category</h2>

        <Carousel 
            responsive={responsive}
            infinite={true}
            // customRightArrow={<CustomRightArrow />}
            // renderArrowNext={<CustomLeftArrow />}
        >
            {best_courses}
        </Carousel>
      </div>
  );
}