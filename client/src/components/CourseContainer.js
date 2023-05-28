import React, { useState, useEffect } from 'react';
import  BestContainer  from './BestContainer'
import AllContainer  from './AllContainer'
import NewestContainer from './NewestContainer'
import Cover from './Cover';

export default function CourseContainer ({query}) {
    const [ filter, setFilter ] = useState('All')

    const handleClick = (category) => {
        setFilter(category);
    }

    console.log(query);
    return (
        <div className="flex justify-center items-center flex-col">
            <div className="m-2 rounded-full flex gap-2 p-2">
                <button className="btn hover:bg-blue-300 font-semibold font-serif" onClick={() => {handleClick('All')}}>All</button>
                <button className="btn hover:bg-blue-300 font-semibold font-serif" onClick={() => {handleClick('Development')}}>Development</button>
                <button className="btn hover:bg-blue-300 font-semibold font-serif" onClick={() => {handleClick('Business')}}>Business</button>
                <button className="btn hover:bg-blue-300 font-semibold font-serif" onClick={() => {handleClick('Finance')}}>Finance</button>
                <button className="btn hover:bg-blue-300 font-semibold font-serif" onClick={() => {handleClick('Design')}}>Design</button>
                <button className="btn hover:bg-blue-300 font-semibold font-serif" onClick={() => {handleClick('IT&Software')}}>IT&Software</button>
                <button className="btn hover:bg-blue-300 font-semibold font-serif" onClick={() => {handleClick('Marketing')}}>Marketing</button>
                <button className="btn hover:bg-blue-300 font-semibold font-serif" onClick={() => {handleClick('Health & fitness')}}>Health & fitness</button>
                <button className="btn hover:bg-blue-300 font-semibold font-serif" onClick={() => {handleClick('Music')}}>Music</button>
                <button className="btn hover:bg-blue-300 font-semibold font-serif" onClick={() => {handleClick('Lifestyle')}}>Lifestyle</button>
            </div>
            {filter === 'All' && query === '' && (
            <>
                <BestContainer />
                <NewestContainer />
            </>
            )}
            
            <AllContainer query={query} filter={filter}/>
        </div>
    )
}