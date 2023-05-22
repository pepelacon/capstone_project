import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext'
import { useLocation } from 'react-router-dom';






export default function LearningPage () {
    const { userId, setUserId } = useContext(UserContext) 
    const location = useLocation();
    const { course } = location.state;

    console.log(course.lessons);
    
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [lessonCompleted, setLessonCompleted] = useState(false);
  
 
    const handleLessonClick = (lesson) => {
      setSelectedLesson(lesson);
      setLessonCompleted(false);
    };
  
    return (
      <div className="flex">
        <div className="w-1/4 bg-gray-200 p-4">
     
          <ul>
            {course.lessons.map((lesson) => (
              <li
                key={lesson.id}
                className={`cursor-pointer mb-2 p-2 ${
                  lesson === selectedLesson ? 'font-bold' : ''
                }`}
                onClick={() => handleLessonClick(lesson)}
              >
                {lesson.title}
                {lessonCompleted && lesson === selectedLesson && (
                  <span className="ml-2">&#10004;</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-3/4 p-4">
          
          {selectedLesson ? (
            <>
              <h2 className="text-xl font-bold mb-2">{selectedLesson.title}</h2>
              <p>{selectedLesson.description}</p>
              <div className="video">
              <video controls>
                <source src={selectedLesson.video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
              </div>
            </>
          ) : (
            <p>Select a lesson from the sidebar to view its content.</p>
          )}
        </div>
      </div>
    );
  };
