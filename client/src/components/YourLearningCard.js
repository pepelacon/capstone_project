import * as React from "react";
import LinearProgress from "@mui/joy/LinearProgress";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { CourseContext } from "../CourseContext";
import { AiFillCloseCircle } from "react-icons/ai";
import Rating from '@mui/material/Rating';

import axios from "axios";

export default function YourLearningCard(course) {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserContext);
  const { setCourse } = useContext(CourseContext);

  const [isOpen, setIsOpen] = useState(false);
  const [review, setReview] = useState("");
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
        if (response.data.length > 0) {
          setIsCommented(true);
        }
      } catch (error) {
        console.error("Error checking existing comment:", error);
      }
    };

    const checkExistingRating = async () => {
      try {
        const response = await axios.get(`/ratings/${userId.id}/${course.id}`);
        if (response.data.length > 0) {
          setIsRated(true);
        }
      } catch (error) {
        console.error("Error checking existing rating:", error);
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
      .post("/ratings", rating_data)
      .then((response) => {
        console.log("Review submitted successfully:", response.data);
        setIsRated(true);
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      });
    axios
      .post("/comments", comment_data)
      .then((response) => {
        console.log("Comment submitted successfully:", response.data);
        setIsCommented(true);
      })
      .catch((error) => {
        console.error("Error submitting comments:", error);
      });

    setIsOpen(false);
  };

  const handleLearnNow = () => {
    navigate(`/learning_process/${id}`, { state: { course } });
  };

  return (
    <div>
      <div className="w-full">
      <img className="max-h-[140px] w-full object-cover" src={picture} alt={title} onClick={handleLearnNow}/>
      <div>
        <p className="font-bold text-sm my-2">{course.title}</p>
      </div>
      <div className="flex-grow">
        <LinearProgress determinate value={progress} />
      </div>
      <div className=" flex justify-between">
        <div className="flex items-center">
          <p className="mr-2 text-sm">{progress}% complete</p>
        </div>
        <div className="flex items-center">
          <button
            className="text-black border-0 text-sm hover:bg-gray-300"
            onClick={handleRateCourse}
            disabled={isRated || isCommented}
          >
            {isRated || isCommented ? 'Rated' : 'Leave a rating'}
          </button>
        </div>
      </div>
      </div>
      {isOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-40 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-white p-4 rounded-xl">
            <h2 className="text-lg font-bold mb-2">Leave a Review</h2>
            <textarea
              className="min-w-[480px] h-32 border border-gray-300 rounded-md p-2 mb-2"
              placeholder="Enter your review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <p className="text-xl flex justify-center">How would you rate this course?</p>
            <div className="flex justify-center">
              <Rating
                name="simple-controlled"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(Number(event.target.value));
                }}
              />
            </div>
            <div className="flex justify-between pt-2">
              <div
                className="mb-0 border-0 rounded-full hover:bg-blue-500"
                onClick={() => setIsOpen(false)}
              >
                <AiFillCloseCircle size={35} />
              </div>
              <button
                className="pt-2 mb-0 border-0 rounded-full hover:bg-gray-300"
                onClick={handleSubmitReview}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
