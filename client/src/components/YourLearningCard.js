import * as React from 'react';
// import Stack from '@mui/joy/Stack';
import LinearProgress from '@mui/joy/LinearProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom"



export default function YourLearningCard (course) {

    const { id, title, picture, average_rating, comments, instructor, lesson_progress } = course
    const roundedRating = Math.round(average_rating * 2) / 2
    console.log(lesson_progress);
    return (  
        <Card className="max-w-sm rounded-lg overflow-hidden shadow-lg">
            <img className="w-full h-56 object-cover" src={picture} alt={title} />
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {instructor.name}
                </Typography>
                <div className="flex items-center mt-4">
                <div className="flex items-center">
                    
                    <Rating name="half-rating-read" value={roundedRating} precision={0.5} readOnly />
                </div>
                <div className="ml-auto">
                    <Link to={`/detail/${id}`} className="text-blue-500 hover:underline" >
                        View Course
                    </Link>
                </div>
                {/* <Stack spacing={2} sx={{ flex: 1 }}> */}
                    
                    
                    
                {/* </Stack> */}
                </div>
            </CardContent>
            <LinearProgress determinate value={75} />
        </Card>
    )
}