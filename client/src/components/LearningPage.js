import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { useLocation } from "react-router-dom";
import Divider from "@mui/material/Divider";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import axios from "axios";


export default function LearningPage() {
  const { userId } = useContext(UserContext);
  console.log(userId.id);
  const location = useLocation();
  const { course } = location.state;
  const [lessonStates, setLessonStates] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(course.lessons[0]);
  const [chatMessages, setChatMessages] = useState([]);

  console.log(chatMessages);

  useEffect(() => {
    const fetchLessonProgress = async () => {
      try {
        const response = await axios.get(
          `/lesson_progression/${userId.id}/${course.id}`
        );
        const lessonProgressData = response.data;
        const lessonStates = {};
        for (const progress of lessonProgressData) {
          lessonStates[progress.lesson_id] = progress.is_passed;
        }
        setLessonStates(lessonStates);
      } catch (error) {
        console.error("Failed to fetch lesson progress data:", error);
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
      console.log(chatMessagesData);
      setChatMessages(chatMessagesData);
    } catch (error) {
      console.error("Failed to fetch chat messages:", error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [selectedLesson.id]);

  const handleSubmitChatMessage = async (event) => {
    event.preventDefault();
    const messageContent = event.target.elements.message.value;

    try {
      const response = await axios.post(
        `/lesson/${selectedLesson.id}/messages`,
        {
          lesson_id: selectedLesson.id,
          sender_id: userId.id,
          content: messageContent,
        }
      );

      const newMessage = response.data;
      console.log(newMessage);
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error("Failed to send chat message:", error);
    }

    event.target.elements.message.value = "";
  };

  return (
    chatMessages && (
      <div className="flex">
        <div className="w-1/4 bg-blue-200 max-h-full p-2">
          <p className="text-lg font-bold pb-2">{course.title}</p>
          <Divider />
          <ul>
            {course.lessons.map((lesson, index) => (
              <li
                key={lesson.id}
                className={`flex items-center cursor-pointer mb-2 text-sm ${
                  lesson === selectedLesson ? "font-bold" : ""
                }`}
                onClick={() => handleLessonClick(lesson)}
              >
                <span className="mr-2">{`Lesson ${index + 1}: ${
                  lesson.title
                }`}</span>
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
              <h2 className="text-xl font-bold mb-2">{selectedLesson.title}</h2>
              <div className="h-[520px] flex justify-center items-center ">
                <video
                  key={selectedLesson.id}
                  controls
                  style={{ width: "100%", height: "100%" }}
                >
                  <source src={selectedLesson.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="max-w-[1024px] mt-4">
                {selectedLesson.description}
              </p>
            </>
          ) : (
            <p>Select a lesson from the sidebar to view its content.</p>
          )}

          <div className="my-4 min-w-[640px]">
              <h3 className="font-semibold border-2">
                All questions in this course
              </h3>
            <div className="max-h-[200px] overflow-y-auto">
              <div className="border-2">
                <ul className="ml-4">
                  {chatMessages.map((message) => (
                    <li
                      key={message.id}
                      className={`flex ${
                        message.sender_id === userId.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-center px-2 py-1 rounded ${
                          message.sender_id === userId.id
                            ? "bg-green-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {message.sender_id === userId.id ? (
                          <>
                            <span className="px-2 text-sm">you: {message.content}</span>
                            <p className="text-sm">{new Date(message.created_at).toLocaleDateString(undefined, { day: 'numeric', month:  'numeric', year: 'numeric' })}</p>
                          </>
                        ) : (
                          <>
                          
                          <p className="text-sm">{new Date(message.created_at).toLocaleDateString(undefined, { day: 'numeric', month:  'numeric', year: 'numeric' })}</p>
                          <span className="pl-2 text-sm">{message.sender.nickname}: {message.content}</span>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center my-2">
              <form className="border-4 mx-auto" onSubmit={handleSubmitChatMessage}>
                <input
                  className="min-w-[300px]"
                  type="text"
                  name="message"
                  placeholder="Enter your message"
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
}