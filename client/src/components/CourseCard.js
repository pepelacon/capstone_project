import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';



export default function CourseCard (course) {
const { id, title, category, description, picture } = course

    return (
        // <div className="flex inline-flex justify-center">
        <div>
            {/* <div className="grid grid-cols-6 gap-4"> */}
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
                        <Typography variant="body2" color="text.secondary">
                            {description}
                        </Typography>
                    </CardContent>
                    </CardActionArea>
                </Card>
            {/* </div>  */}
         </div>
    )

}