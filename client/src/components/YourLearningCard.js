import * as React from "react";
import LinearProgress from "@mui/joy/LinearProgress";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from '../UserContext'
import axios from 'axios';


export default function YourLearningCard(course) {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserContext) 
  const [isOpen, setIsOpen] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [isCommented, setIsCommented] = useState(false);
  const [isRated, setIsRated] = useState(false);

  const { id, title, picture, lesson_progress } = course;
  let isDone = lesson_progress.filter((el) => el.is_passed === true);
  let progress; 
  if (isDone.length === 0) {
    progress = 0;
  } else {
    progress = Math.floor((isDone.length / lesson_progress.length) * 100);
  }
  
  useEffect(() => {
    const checkExistingComment = async () => {
      try {
        const response = await axios.get(`/comments/${userId.id}/${course.id}`);
        if (response.data.length > 0,
          console.log(response.data.length )) {
          setIsCommented(true);
        }
      } catch (error) {
        console.error('Error checking existing comment:', error);
      }
    };

    const checkExistingRating = async () => {
      try {
        const response = await axios.get(`/ratings/${userId.id}/${course.id}`);
        if (response.data.length > 0) {
          setIsRated(true);
        }
      } catch (error) {
        console.error('Error checking existing rating:', error);
      }
    };

    checkExistingComment();
    checkExistingRating();
  }, [course.id, userId.id]);

  const handleRateCourse = () => {
    setIsOpen(true);
  };

  const handleSubmitReview = () => {
    const comment_data = {
      course_id: course.id,
      user_id: userId.id,
      content: review,
    };
    const rating_data = {
      course_id: course.id,
      user_id: userId.id,
      rating: rating,
    };
    axios
      .post('/ratings', rating_data)
      .then((response) => {
        console.log('Review submitted successfully:', response.data);
        setIsRated(true); 
      })
      .catch((error) => {
        console.error('Error submitting review:', error);
      });
    axios
      .post('/comments', comment_data)
      .then((response) => {
        console.log('Comment submitted successfully:', response.data);
        setIsCommented(true); 
      })
      .catch((error) => {
        console.error('Error submitting comments:', error);
      });
  
    setIsOpen(false); 
  };

  const handleLearnNow = () => {
    navigate(`/learning_process/${id}`, { state: { course } });
  };

  return (
    <div>
      <div className="rounded-xl relative">
        <div className="absolute w-full h-full bg-black/50 rounded-xl text-white">
          <p className="font-bold text-sm px-2 pt-4">{course.title}</p>
          <button
            className="border-white bg-white text-black mx-2 absolute bottom-4"
            onClick={handleLearnNow}
          >
            learn now
          </button>
          <button
          className="border-white bg-white text-black mx-2 absolute bottom-4 ml-32"
          onClick={handleRateCourse}
          disabled={isRated || isCommented}
        >
          {isRated || isCommented ? 'Rated' : 'Rate this course'}
        </button>
        </div>
        <img
          className="max-h-[140px]  w-full object-cover rounded-xl"
          src={picture}
          alt={title}
        />

        <LinearProgress determinate value={progress} />
      </div>
      {isOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/50">
          <div className="bg-white p-4 rounded-xl">
            <h2 className="text-lg font-bold mb-2">Leave a Review</h2>
            <textarea
              className="w-full h-32 border border-gray-300 rounded-md p-2 mb-2"
              placeholder="Enter your review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <label className="block mb-2">
              Rating:
              <input
                type="number"
                min={1}
                max={5}
                className="border border-gray-300 rounded-md p-2 w-20"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </label>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
              onClick={() => setIsOpen(false)}
            >
              close
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
              onClick={handleSubmitReview}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
