import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Rating from "@mui/material/Rating";
import { HiChevronLeft } from "react-icons/hi";

export const CourseDetail = () => {
  const { userId } = useContext(UserContext);
  const [courseInfo, setCourseInfo] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);

  const navigate = useNavigate();

  const roundedRating = Math.round(courseInfo.average_rating * 2) / 2;
  const roundedRatingToShow = Math.round(courseInfo.average_rating * 10) / 10;
  const enrolledUsers = courseInfo.enrolled_users?.length || 0

  let { id: courseId } = useParams();

  console.log(courseInfo);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await fetch(`/course/${courseId}`);
        const courseData = await courseResponse.json();
        setCourseInfo(courseData);
        let enrolled = courseData.enrolled_users.filter(
          (user) => user.id === userId.id
        );
        if (enrolled.length !== 0) {
          setIsEnrolled(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [courseId]);

  const handleAddCourse = () => {
    fetch(`/enrollments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_id: courseInfo.id,
        user_id: userId.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsEnrolled(true);
        const enrollmentId = data.id;
        fetch(`/lesson_progression/${userId.id}/${courseInfo.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            enrollment_id: enrollmentId,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          });
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
              <div className="text-md md:text-2xl font-bold">
                {courseInfo.title}
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
                <div className="ml-2 text-base text-md md:mr-2">({enrolledUsers})</div>
              </div>

              <div className="text-md text-center md:text-left md:text-lg text-darkGrayishBlue mt-2 font-bold">
                Description:
              </div>
              <p className="text-sm md:text-base text-center md:text-left text-darkGrayishBlue w-full">
                {courseInfo.description}
              </p>

              <div className=" mt-2">
                <div className="text-md text-center md:text-left md:text-lg text-darkGrayishBlue mt-2 font-bold">
                  What you'll learn:
                </div>
                <ul className="text-sm md:text-lg text-center md:text-left text-darkGrayishBlue w-full">
                  {courseInfo.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="flex text-base items-center space-x-2"
                    >
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
                    </li>
                  ))}
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
              <img
                src={courseInfo.picture}
                alt="Course"
                className="h-[250px] aspect-w-1 mx-auto"
              />
              <p className="text-center text-darkGrayishBlue md:text-left">
                Author: {courseInfo.instructor.name}
              </p>

              {!userId ? (
                <button id="single-card-button" size="medium" disabled>
                  You need to register to apply
                </button>
              ) : !isEnrolled ? (
                <button
                  id="single-card-button"
                  size="medium"
                  onClick={handleAddCourse}
                >
                  Add Course
                </button>
              ) : (
                <button disabled>Enrolled</button>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              navigate("/");
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
