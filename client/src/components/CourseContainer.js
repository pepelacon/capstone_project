import React, { useState, useEffect } from 'react';
import  BestContainer  from './BestContainer'
import AllContainer  from './AllContainer'





export default function CourseContainer ({query}) {
    
    
    return (
        <div className="flex justify-center items-center flex-col">
            <BestContainer />
            <AllContainer query={query}/>
        </div>

    )

}