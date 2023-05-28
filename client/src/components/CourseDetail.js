import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext'
import Rating from '@mui/material/Rating';


export const CourseDetail = () => {
    const { userId } = useContext(UserContext) 
    const [ courseInfo, setCourseInfo ] = useState({})
    const [isEnrolled, setIsEnrolled] = useState(false)
    
    const roundedRating = Math.round(courseInfo.average_rating * 2) / 2
    const roundedRatingToShow = (Math.round(courseInfo.average_rating * 10) / 10);
    let { id: courseId } = useParams()

    console.log(userId);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
            const courseResponse = await fetch(`/course/${courseId}`);
            const courseData = await courseResponse.json();
            setCourseInfo (courseData);
            let enrolled  = courseData.enrolled_users.filter((user) => (
                user.id === userId.id
            ))
            if (enrolled.length !== 0){
                setIsEnrolled(true)
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
        }

    return (
        <section id="features">
    {Object.keys(courseInfo).length === 0 ? (
        <div>Loading...</div>
    ) : (
        <div className="container justify-center w-3/4 md:w-1/2 flex flex-col mx-auto mt-16 space-y-12 md:space-y-0 md:flex-row">
            <div className="w-full md:w-3/4 items-center justify-center pr-4 md:justify-start md:text-left" >
                <div className="text-md md:text-2xl font-bold">
                    {courseInfo.title}
                </div>
                
                <div className="max-w-sm flex justify-center md:justify-start items-center font-bold text-darkGrayishBlue ">
                    <span className="text-orange-700 font-bold text-lg md:mr-2">{roundedRatingToShow}</span>
                    <Rating
                        name="half-rating-read"
                        value={roundedRating}
                        precision={0.5}
                        readOnly
                        size="small"
                    />
                </div>
                
                <span className="text-md text-center md:text-left md:text-lg text-darkGrayishBlue font-bold ">Description: </span>
                <p className="text-sm md:text-lg text-center md:text-left text-darkGrayishBlue w-full">
                    {courseInfo.description}
                </p>
                                {/* <h2>Lesson List</h2>
                                    <ul>
                                        {courseInfo.lessons.map((lesson) => (
                                        <li key={lesson.id}>{lesson.title}</li>
                                        ))}
                                    </ul>
                                <h2>Comments List</h2>
                                    <ul>
                                        {courseInfo.comments.map((comment) => (
                                        <li key={comment.id}>{comment.content}</li>
                                        ))}
                                    </ul> */}
              
            </div>
            <div className="flex flex-col space-y-3 w-full md:w-1/3 mx-auto">
                <img
                    src={courseInfo.picture}
                    alt="Course"
                    className='h-[300px] aspect-w-1 mx-auto '
                />
                <p className="text-center font-bold text-darkGrayishBlue md:text-left ">
                    Author: {courseInfo.instructor.name}
                </p>
                
                {!userId ? (
                    <button id="single-card-button" size="medium" disabled>
                        You need to register to apply
                    </button>
                    ) : !isEnrolled ? (
                    <button id="single-card-button" size="medium" onClick={handleAddCourse}>
                        Add Course
                    </button>
                    ) : (
                    <button disabled>Enrolled</button>
                )}
            </div>
        </div>
    )}
    </section>
         
    )
}


