import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CourseContext } from '../CourseContext';

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

  const handleVideoChange = (event) => {
    const selectedVideo = event.target.files[0];
    setVideo(selectedVideo);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      video: null,
    },
    validationSchema,
    onSubmit: (values) => {
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
            console.log('Video uploaded:', data);
          })
          .catch((error) => {
            console.error('Error uploading video:', error);
          });
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-102 bg-blue shadow-lg rounded-lg px-8 py-6">
        <h2 className="text-2xl text-blue-900 font-bold mb-4">Create a new lesson!</h2>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="file"
            onChange={(event) => {
              formik.setFieldValue('video', event.target.files[0]);
              handleVideoChange(event);
            }}
            accept="video/*"
          />
          {formik.errors.video && formik.touched.video && (
            <div className="text-red-500">{formik.errors.video}</div>
          )}
          {video && (
            <div className="max-w-[480px] max-h-[320]">
              <video controls>
                <source src={URL.createObjectURL(video)} type={video.type} />
              </video>
            </div>
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

          <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateLesson;


