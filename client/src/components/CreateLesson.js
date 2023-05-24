import React from 'react'
import { useContext, useState } from 'react'
import { useFormik } from "formik"
import * as yup from "yup"
import { UserContext } from '../UserContext'
import { CourseContext } from '../CourseContext'



function CreateLesson() {
    const { userId } = useContext(UserContext) 
    const { course } = useContext(CourseContext) 

    const [video, setVideo] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleDescription = (event) => {
        setDescription(event.target.value)
    }
    const handleTitle = (event) => {
        setTitle(event.target.value)
    }

    const handleVideoChange = (event) => {
        const selectedVideo = event.target.files[0];
        setVideo(selectedVideo);
      };

    const handleVideoUpload = () => {
        if (video) {
          const formData = new FormData();
          formData.append('video', video);
          formData.append('course_id', course.id);
          formData.append('description', description);
          formData.append('title', title);
        

    
          fetch('/create_lesson', {
            method: 'POST',
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('Video uploaded:', data);
            })
            .catch((error) => {
              console.error('Error uploading video:', error);
            });
        }
      };

  return (
    <div className="flex items-center justify-center h-screen" >
      <div className="w-102 bg-blue shadow-lg rounded-lg px-8 py-6">
        <h2 className="text-2xl text-blue-900 font-bold mb-4">Create a new lesson!</h2>
        <input type="file" onChange={handleVideoChange} accept="video/*" />
        {video && (
            <div className='max-w-[480px] max-h-[320]'>
                <video controls>
                <source src={URL.createObjectURL(video)} type={video.type} />
                </video>
            </div>
        )}
        <h4>Title:</h4>
        <input onChange={handleTitle} type="text" value={title} className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"/>
        <h4>Description:</h4>
        <textarea 
                    type='text' 
                    rows='4' 
                    cols='50' 
                    name='description'
                    value={description} 
                    onChange={handleDescription} 
                    className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                />
                
        <button onClick={handleVideoUpload}>Upload</button>
        
        </div>
        </div>
       
  )
}
  
export default CreateLesson

