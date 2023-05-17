import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';



export default function CourseCard (course) {
const { id, title, category, description, picture, average_rating } = course
const roundedRating = Math.round(average_rating * 2) / 2
console.log(roundedRating);
    return (
        
        <Box
            sx={{
                '& > legend': { mt: 2 },
            }}
        >
            
                <Card sx={{ minWidth: 150, maxWidth: 300 }}>
                    <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        image={picture}
                        alt={title}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            {title}
                        </Typography>
                        <Typography component="legend">Read only</Typography>
                        <Rating name="half-rating-read" value={roundedRating} precision={0.5} readOnly />
                        
                    </CardContent>
                    </CardActionArea>
                </Card>
            
        </Box>
    )

}