import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CourseContext } from '../CourseContext';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';



const validationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  video: yup
    .mixed()
    .test('fileType', 'Invalid file format', (value) => {
      if (value) {
        const supportedFormats = ['video/mp4', 'video/mpeg', 'video/quicktime'];
        return supportedFormats.includes(value.type);
      }
      return true;
    })
    .required('Video is required'),
});

function CreateLesson() {
  const { course } = useContext(CourseContext);
  const [video, setVideo] = useState(null);
  const [lesson, setLessons] = useState(course.lessons)
  const navigate = useNavigate()

  console.log(course);

  console.log(lesson);
  const handleVideoChange = (event) => {
    const selectedVideo = event.target.files[0];
    setVideo(selectedVideo);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      video: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (values.video) {
        const formData = new FormData();
        formData.append('video', values.video);
        formData.append('course_id', course.id);
        formData.append('description', values.description);
        formData.append('title', values.title);

        fetch('/create_lesson', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            setLessons((prev) => [...prev, data]);
            console.log('Video uploaded:', data);
            resetForm();
            setVideo(null)
          })
          .catch((error) => {
            console.error('Error uploading video:', error);
          });
      }
    },
  });

  const handleVideoDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    formik.setFieldValue('video', file);
    setVideo(file);
    
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleVideoDrop,
    accept: 'video/*',
    multiple: false,
  });

  const handleFinish = () => {
    setLessons([])
    navigate('/instructor_courses')
  }

  return (
    <div className="flex items-center justify-center py-16"> 
      <div className='flex flex-col'>
        <div>
          <h2 className='text-2xl font-bold'>Course: {course.title}</h2>
        </div>

        <div className="w-102 bg-blue shadow-lg rounded-lg px-8 py-6">
          <h2 className="text-xl text-blue-900 font-bold mb-4">Create lesson number {lesson.length + 1}</h2>
          <form onSubmit={formik.handleSubmit}>
          <div
              {...getRootProps()}
              className={`w-full px-3 py-2 border mb-2 flex justify-center rounded focus:outline-none focus:border-blue-500 ${
                formik.errors.video && formik.touched.video ? 'border-red-500' : 'border-blue-300'
              } ${isDragActive ? 'border-blue-500' : ''}`}
            >
              <input {...getInputProps()} />
              {video ? (
                <video controls style={{ maxWidth: '406px', maxHeight: '100%' }}>
                  <source src={URL.createObjectURL(video)} type={video.type}/>
                </video>
              ) : isDragActive ? (
                <p>Drop the video file here...</p>
              ) : (
                <p>Drag and drop a video file here, or click to select a video</p>
              )}
            </div>
            {formik.errors.video && formik.touched.video && (
              <div className="text-red-500">{formik.errors.video}</div>
            )}
            <h4>Title:</h4>
            <input
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
            />
            {formik.errors.title && formik.touched.title && (
              <div className="text-red-500">{formik.errors.title}</div>
            )}
            <h4>Description:</h4>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
            />
            {formik.errors.description && formik.touched.description && (
              <div className="text-red-500">{formik.errors.description}</div>
            )}
            <div className='flex justify-between'>
              
              <button className="rounded-full hover:bg-blue-300" type="submit" disabled={!formik.isValid || formik.isSubmitting}>
                Upload
              </button>
              { lesson.length > 0 ?

                <button className="rounded-full hover:bg-blue-300" type="submit" onClick={handleFinish}>
                  Finish
                </button> :
                <h2>
                  You need to add at least one lesson
                </h2>

              }
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateLesson;


