import * as React from 'react';
import Rating from '@mui/material/Rating';
import { useNavigate } from 'react-router-dom';




export default function CourseCard (course) {
    const navigate = useNavigate()
    const { id, title, picture, average_rating, comments, instructor } = course
    const roundedRating = Math.round(average_rating * 2) / 2
    const roundedRatingToShow = (Math.round(average_rating * 10) / 10);

    
    return (  
        <div className="max-w-sm rounded-sm overflow-hidden" onClick={() => navigate(`/detail/${id}`)}>
            <img className="w-full h-36 object-cover" src={picture} alt={title} />
            <div className='mt-2 text-left'>
                <div className="line-clamp-2 font-bold text-sm ">
                    {title}
                </div>
                <div className="text-gray-500 text-sm mt-1 mb-2">
                    {instructor.name}
                </div>
                <div className="flex items-center mt-1">
                    <div className="flex mr-1 text-orange-700 font-bold text-sm">
                        <p>{roundedRatingToShow}</p>
                    </div>
                    <div className="flex ">
                        <Rating  name="half-rating-read" value={roundedRating} precision={0.5} readOnly size="small"/>
                    </div>
                
                </div>
            </div>
        </div>
    )
}