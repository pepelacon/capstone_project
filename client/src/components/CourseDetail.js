import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext'
import Rating from '@mui/material/Rating';


export const CourseDetail = () => {
    const { userId } = useContext(UserContext) 
    const [ courseInfo, setCourseInfo ] = useState({})
    const [isEnrolled, setIsEnrolled] = useState(false)
    
    const roundedRating = Math.round(courseInfo.average_rating * 2) / 2
    let { id: courseId } = useParams()

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
            setIsEnrolled(true)
            console.log(data);
            });
    }

    return (
        <section id="features">
            {Object.keys(courseInfo).length === 0 ? (
                <div>Loading...</div>
                ) : (
            <div className="container justify-center flex flex-col px-4 mx-auto mt-10 space-y-12 md:space-y-0 md:flex-row">
                { !isEnrolled ? 
                    (<button id='single-card-button' size="medium" onClick={handleAddCourse}>Add Course</button> ) : 
                    (<button >User Enrolled to rhis course</button> )
                }
                <div>
                    <h2>Lesson List</h2>
                    <ul>
                        {courseInfo.lessons.map((lesson) => (
                        <li key={lesson.id}>{lesson.title}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2>Comments List</h2>
                    <ul>
                        {courseInfo.comments.map((comment) => (
                        <li key={comment.id}>{comment.content}</li>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col space-y-3 md:w-3/8">
                    <img src={courseInfo.picture} alt="Course"  style={{ width: '300px', height: '300px' }}/>
                    <h4 class="max-w-md text-xl font-bold text-center md:text-left">
                        {courseInfo.title}
                    </h4>
                    <p className="max-w-sm items-center text-center font-bold text-darkGrayishBlue md:text-left">
                        Rating: <Rating name="half-rating-read" value={roundedRating} precision={0.5} readOnly />
                    </p>
                    <p className="max-w-sm items-center text-center font-bold text-darkGrayishBlue md:text-left">
                        Author: {courseInfo.instructor.name}
                    </p>
                    <h5 className="max-w-sm text-center text-darkGrayishBlue md:text-left mt-0">
                        <p className="max-w-sm text-center mb-2 font-bold text-darkGrayishBlue md:text-left">
                            Description:
                        </p>
                        {courseInfo.description}
                    </h5>
                </div>
            </div>)}
        </section>
         
    )
}


