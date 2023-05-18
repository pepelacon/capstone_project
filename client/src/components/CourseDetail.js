import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext'




export const CourseDetail = () => {
    const { userId } = useContext(UserContext) 

    let { id: postId } = useParams()
    console.log(userId);
    
    // const { username, id } = user;
    const navigate = useNavigate()
    
 // get info about CARD and FRIENDS



        
        return (
        <div id='single-card-screen' >
            <p>Somethin you need to know</p>
        </div>
    )
}


