import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import './BestContainer.css'
export default function BestContainer() {
  const navigate = useNavigate();
  const [bestCourses, setBestCourses] = useState([]);
  const sliderRef = useRef(null);

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

  const handleSliderPrev = () => {
    const cardWidth = sliderRef.current.querySelector('.slide').offsetWidth;
    sliderRef.current.scrollLeft -= cardWidth * 5;
  };

  const handleSliderNext = () => {
    const cardWidth = sliderRef.current.querySelector('.slide').offsetWidth;
    sliderRef.current.scrollLeft += cardWidth * 5;
  };

  return (
    <div className="flex justify-center items-center">
      <div className="mt-16 w-4/5">
        <div className="slider" ref={sliderRef}>
          {bestCourses.map((course) => {
            const roundedRating = Math.round(course.average_rating * 2) / 2;
            const roundedRatingToShow = Math.round(course.average_rating * 10) / 10;

            return (
              <div
                className="slide"
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
              >
                <img className="w-full h-36 object-cover" src={course.picture} alt={course.title} />
                <div className="mt-2 text-left">
                  <div className="line-clamp-2 font-bold text-sm">{course.title}</div>
                  <div className="text-gray-500 text-sm mt-1 mb-2">{course.instructor.name}</div>
                  <div className="flex items-center mt-1">
                    <div className="flex mr-1 text-orange-700 font-bold text-sm">
                      <p>{roundedRatingToShow}</p>
                    </div>
                    <div className="flex">
                      <Rating name="half-rating-read" value={roundedRating} precision={0.5} readOnly size="small" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="slider-controls">
          <button className="slider-control-btn" onClick={handleSliderPrev}>
            Previous
          </button>
          <button className="slider-control-btn" onClick={handleSliderNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}