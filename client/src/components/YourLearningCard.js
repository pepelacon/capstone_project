import * as React from 'react';

import LinearProgress from '@mui/joy/LinearProgress';


import { useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react'


export default function YourLearningCard (course) {
    const navigate = useNavigate()
    const { id, title, picture, instructor, lesson_progress } = course
   
    const handleLearnNow = () => {
        navigate(`/learning_process/${id}`, { state: { course } });
      };
  
    return (  

        <div>
            <div className='rounded-xl relative'>
                <div className='absolute w-full h-full bg-black/50 rounded-xl text-white'>
                    <p className='font-bold text-2xl px-2 pt-4'>SunsOut</p>
                    <p className='px-2'>Throght</p>
                    <button 
                        className='border-white bg-white text-black mx-2 absolute bottom-4'
                        onClick={handleLearnNow}
                    >
                        learn now
                    </button>

                </div>
                <img
                    className='max-h-[140px]  w-full object-cover rounded-xl'
                    src={picture}
                    alt={title}
                />
                
            <LinearProgress determinate value={75} />
            </div>
        </div>
    )
}