import * as React from 'react';
import Rating from '@mui/material/Rating';
import { useNavigate } from 'react-router-dom';




export default function Cover () {
    
 
    return (  
        <div className="max-w-[1640px] mx-auto p-4">
            <div className='max-h-[500px] relative'>
                <div className='absolute w-full h-full text-gray-200 max-h-[500px] bg-black/40 flex flex-col justify-center'>

                    <h1>The <span>Best</span></h1>
                    <h1>Education<span>Platform</span></h1>
                </div>
            </div>
            <img src='https://images.pexels.com/photos/1333320/pexels-photo-1333320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'/>
        </div>
    )
}