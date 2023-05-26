import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext'
import { useLocation, useParams } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import axios from 'axios';


export default function LearningPage() {
  const { userId } = useContext(UserContext);
  const location = useLocation();
  const { course } = location.state;
  const [lessonStates, setLessonStates] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(course.lessons[0]);
  const [chatMessages, setChatMessages] = useState([]);
 
  console.log(chatMessages);

  useEffect(() => {
    const fetchLessonProgress = async () => {
      try {
        const response = await axios.get(`/lesson_progression/${userId.id}/${course.id}`);
        const lessonProgressData = response.data;
        const lessonStates = {};
        for (const progress of lessonProgressData) {
          lessonStates[progress.lesson_id] = progress.is_passed;
        }
        setLessonStates(lessonStates);
      } catch (error) {
        console.error('Failed to fetch lesson progress data:', error);
      }
    };

    fetchLessonProgress();
  }, [userId, course.id]);

  const handleMarkButtonClick = async (e, lesson) => {
    e.stopPropagation();
    setLessonStates((prevState) => ({
      ...prevState,
      [lesson.id]: !prevState[lesson.id],
    }));

    try {
      await axios.patch(`/lesson_progression/${userId.id}/${course.id}`, {
        lesson_id: lesson.id,
        is_passed: !lessonStates[lesson.id],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  const fetchChatMessages = async () => {
    try {
      const response = await axios.get(`/lesson/${selectedLesson.id}/messages`);
      const chatMessagesData = response.data;
      setChatMessages(chatMessagesData);
    } catch (error) {
      console.error('Failed to fetch chat messages:', error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [ selectedLesson.id]);

  const handleSubmitChatMessage = async (event) => {
    event.preventDefault();
    const messageContent = event.target.elements.message.value;
  
    try {
      const response = await axios.post(`/lesson/${selectedLesson.id}/messages`, {
        lesson_id: selectedLesson.id,
        sender_id: userId.id,
        content: messageContent
      });
  
      const newMessage = response.data; 
      console.log(newMessage);
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error('Failed to send chat message:', error);
    }
  
    event.target.elements.message.value = '';
  };


  return (
    <div className="flex">
      <div className="w-1/4 bg-blue-200 max-h-full p-2">
        <p className="text-lg font-bold pb-2">Course content</p>
        <Divider />
        <ul>
          {course.lessons.map((lesson, index) => (
            <li
              key={lesson.id}
              className={`flex items-center cursor-pointer mb-2 ${
                lesson === selectedLesson ? 'font-bold' : ''
              }`}
              onClick={() => handleLessonClick(lesson)}
            >
              <span className="mr-2">{`Lesson ${index + 1}:`}</span>
              <span>{lesson.title}</span>
              <div className="ml-auto">
                <button
                  className="focus:outline-none border-none flex items-center"
                  onClick={(e) => handleMarkButtonClick(e, lesson)}
                >
                  {lessonStates[lesson.id] ? (
                    <CheckBoxOutlinedIcon />
                  ) : (
                    <CheckBoxOutlineBlankOutlinedIcon />
                  )}
                </button>
              </div>
              <Divider />
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 flex flex-col justify-center items-center mt-4">
        {selectedLesson ? (
          <>
            <h2 className="text-xl font-bold">{selectedLesson.title}</h2>
            <div className="h-[520px] flex justify-center items-center ">
              <video
                key={selectedLesson.id}
                controls
                style={{ width: '100%', height: '100%' }}
              >
                <source src={selectedLesson.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <p>{selectedLesson.description}</p>
          </>
        ) : (
          <p>Select a lesson from the sidebar to view its content.</p>
        )}

      <div>
        <h3>Chat</h3>
        <ul>
        {chatMessages.map((message) => (
          <li key={message.id}>
            <strong>{message.sender_id}</strong>: {message.content}
          </li>
        ))}
      </ul> 
      </div>

        
        <form onSubmit={handleSubmitChatMessage}>
          <input type="text" name="message" placeholder="Enter your message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}