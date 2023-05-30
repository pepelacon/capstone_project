import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Rating from "@mui/material/Rating";
import { HiChevronLeft } from "react-icons/hi";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { CourseContext } from "../CourseContext";
import { BiEditAlt } from "react-icons/bi";
import { HiCheck, HiPlusCircle, HiMinusSm } from "react-icons/hi";

export const EditDetail = () => {
  const { userId } = useContext(UserContext);
  const { course, setCourse } = useContext(CourseContext);

  const [courseInfo, setCourseInfo] = useState({});

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingProfilePicture, setIsEditingProfilePicture] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedProfilePicture, setEditedProfilePicture] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [deletedLessonId, setDeletedLessonId] = useState(null);

  const navigate = useNavigate();

  const roundedRating = Math.round(courseInfo.average_rating * 2) / 2;
  const roundedRatingToShow = Math.round(courseInfo.average_rating * 10) / 10;
  const enrolledUsers = courseInfo.enrolled_users?.length || 0;
  console.log(course);
  let { id: courseId } = useParams();

  console.log(courseInfo);
  useEffect(() => {
    fetchCourseDetails(courseId);
  }, [courseId]);

  const fetchCourseDetails = async (id) => {
    try {
      const response = await fetch(`/edit/${id}`);
      const data = await response.json();
      setCourseInfo(data);
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  const handleDeleteCourse = () => {
    axios
      .delete(`/edit/${courseId}`)
      .then((response) => {
        console.log("Course deleted:", response.data);
        navigate("/instructor_courses");
      })
      .catch((error) => {
        console.error("Error deleting:", error);
      });
  };

  const handleEditDescription = () => {
    setIsEditingDescription(true);
    setEditedDescription(courseInfo.description);
  };

  const handleSaveDescription = async () => {
    try {
      const response = await fetch(`/edit/${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: editedDescription }),
      });
      if (response.ok) {
        setIsEditingDescription(false);
        fetchCourseDetails(courseId);
      } else {
        console.error("Failed to update description");
      }
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  const handleEditTitle = () => {
    setIsEditingTitle(true);
    setEditedTitle(courseInfo.title);
  };

  const handleSaveTitle = async () => {
    try {
      const response = await fetch(`/edit/${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editedTitle }),
      });
      if (response.ok) {
        setIsEditingTitle(false);
        fetchCourseDetails(courseId);
      } else {
        console.error("Failed to update title");
      }
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  const handlePictureDrop = async (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];
      const formData = new FormData();
      if (file === null) {
        formData.append("fileExists", "false");
      } else {
        formData.append("fileExists", "true");
        formData.append("picture", file);
        setPreviewImage(URL.createObjectURL(file));
      }

      console.log(file);
      const response = await fetch(`/edit/${courseId}`, {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        setIsEditingProfilePicture(false);
        fetchCourseDetails(courseId);
      } else {
        console.error("Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handlePictureDrop,
    accept: "image/*",
    multiple: false,
  });

  const handleEditProfilePicture = () => {
    setIsEditingProfilePicture(true);
    setEditedProfilePicture(courseInfo.picture);
  };

  const deleteLesson = (lessonId) => {
    console.log(lessonId);
    axios
      .delete(`/lesson/${lessonId}`)
      .then((response) => {
        console.log("lesson deleted:", response.data);
        setDeletedLessonId(lessonId);
      })
      .catch((error) => {
        console.error("Error deleting:", error);
      });
  };

  return (
    <section id="features">
      {Object.keys(courseInfo).length === 0 ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="container justify-center w-3/4 md:w-1/2 flex flex-col mx-auto my-16 space-y-12 md:space-y-0 md:flex-row">
            <div className="w-full md:w-3/4 items-center justify-center pr-4 md:justify-start md:text-left">
              <div className="flex items-center justify-between text-md md:text-2xl font-bold">
                {isEditingTitle ? (
                  <>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="border-4 border-blue-300"
                    />
                    <button
                      onClick={handleSaveTitle}
                      className="text-black-500 mt-2 hover:bg-blue-500 border-none justife-end rounded-full ml-2"
                    >
                      <HiCheck size={25} />
                    </button>
                  </>
                ) : (
                  courseInfo.title
                )}

                {!isEditingTitle && (
                  <button
                    onClick={handleEditTitle}
                    className="text-black-500 mt-2 hover:bg-blue-500 border-none rounded-full ml-2"
                  >
                    <BiEditAlt size={25} />
                  </button>
                )}
              </div>

              <div className="max-w-sm flex justify-center md:justify-start items-center font-bold text-darkGrayishBlue">
                <div className="text-orange-700 font-bold text-md md:mr-2">
                  {roundedRatingToShow}
                </div>
                <Rating
                  name="half-rating-read"
                  value={roundedRating}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <div className="ml-2 text-base text-md md:mr-2">
                  ({enrolledUsers})
                </div>
              </div>

              <div className="flex items-center mt-2 justify-between">
                <div className="text-md text-center md:text-left md:text-lg text-darkGrayishBlue font-bold">
                  Description:
                </div>
                <div>
                  {isEditingDescription ? (
                    <button
                      onClick={handleSaveDescription}
                      className="text-black-500 mt-2 hover:bg-blue-500 border-none rounded-full ml-2"
                    >
                      <HiCheck size={25} />
                    </button>
                  ) : (
                    <button
                      onClick={handleEditDescription}
                      className="text-black-500 h-100% hover:bg-blue-500 border-none rounded-full"
                    >
                      <BiEditAlt size={25} />
                    </button>
                  )}
                </div>
              </div>

              {isEditingDescription ? (
                <div className="flex">
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full"
                  />
                </div>
              ) : (
                <div className="flex justify-between">
                  <p className="text-sm md:text-base text-center md:text-left text-darkGrayishBlue w-full">
                    {courseInfo.description}
                  </p>
                </div>
              )}

              <div className=" mt-6">
                <div className="flex justify-between items-center">
                  <div className="text-md  text-center md:text-left md:text-lg text-darkGrayishBlue font-bold">
                    What you'll learn:
                  </div>
                  <button
                    className="itens-center flex border-none rounded-full hover:bg-blue-500"
                    onClick={() => navigate("/create_lesson")}
                  >
                    <HiPlusCircle size={25} />
                  </button>
                </div>
                <ul className="text-sm md:text-lg text-center md:text-left text-darkGrayishBlue w-full">
                  {courseInfo.lessons.map(
                    (lesson) =>
                      lesson.id !== deletedLessonId && (
                        <li
                          key={lesson.id}
                          className="flex text-base items-center space-x-2"
                        >
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2 text-green-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M0 11l2-2 5 5L18 3l2 2L7 18z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {lesson.title}
                            </div>
                            <div>
                              <button
                                className="items-center flex border-none rounded-full hover:bg-blue-500"
                                onClick={() => deleteLesson(lesson.id)}
                              >
                                <HiMinusSm size={25} />
                              </button>
                            </div>
                          </div>
                        </li>
                      )
                  )}
                </ul>
              </div>
              <div className=" mt-2">
                <div className="text-md text-center md:text-left md:text-lg text-darkGrayishBlue mt-2 font-bold">
                  Comments:
                </div>
                <ul className="text-sm md:text-lg text-center md:text-left text-darkGrayishBlue w-full">
                  {courseInfo.comments.map((comment) => (
                    <li
                      key={comment.id}
                      className="flex p-2 items-center space-x-2"
                    >
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.nickname}
                        className="w-16 h-16 mr-2 rounded-full"
                      />
                      <div>
                        <div className="text-base font-bold">
                          {comment.user.nickname}
                        </div>
                        <div className="text-base">{comment.content}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col space-y-3 w-full md:w-1/3 mx-auto">
              {isEditingProfilePicture ? (
                <>
                  <div
                    {...getRootProps()}
                    className="w-full px-3 py-2 border mb-2 flex justify-center rounded focus:outline-none focus:border-blue-500"
                  >
                    <input {...getInputProps()} />
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Dropped Image"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    ) : isDragActive ? (
                      <p>Drop the file here...</p>
                    ) : (
                      <p>
                        Drag and drop an image here, or click to select an image
                      </p>
                    )}
                  </div>
                  <button onClick={handlePictureDrop}>Save</button>
                </>
              ) : (
                <>
                  <img
                    src={courseInfo.picture}
                    alt="Course"
                    className="object-cover object-center h-[200px] mx-auto"
                  />
                  <p className="text-center text-darkGrayishBlue md:text-left">
                    Author: {courseInfo.instructor.name}
                  </p>
                  <button
                    onClick={handleEditProfilePicture}
                    className="text-blue-500"
                  >
                    Edit Profile Picture
                  </button>
                </>
              )}

              <button
                className="hover:bg-blue-300 rounded-full"
                onClick={handleDeleteCourse}
              >
                Delete course
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              navigate("/instructor_courses");
            }}
            className="p-2 rounded-full hover:bg-gray-300 fixed top-36 left-8"
          >
            <HiChevronLeft size={25} />
          </button>
        </>
      )}
    </section>
  );
};
