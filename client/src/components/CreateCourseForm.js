import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { useFormik } from "formik"
import * as yup from "yup"
import { UserContext } from '../UserContext'
import { CourseContext } from '../CourseContext'
import { useDropzone } from 'react-dropzone';

import { Typography } from '@mui/material';

function CreateCourseForm() {
    const { userId } = useContext(UserContext) 
    const { setCourse } = useContext(CourseContext) 
    const navigate = useNavigate();

    const formSchema = yup.object().shape({
        title: yup.string().required("Enter a title"),
        category: yup.string().required("Pick a category"),
        picture: yup.string().required("Add a picture"),
        description: yup.string().required("Enter a description"),  
    })

    const formik = useFormik({
        initialValues: {
            title:'',
            category:'',
            picture:'',
            description:'',
            instructor_id: userId.id,
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
        
        fetch("/course", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...values,
                picture: values.picture,
              }),
        }).then((res) => {
            if(res.ok) {
            res.json().then(post => {
                setCourse(post);
                navigate(`/create_lesson`)
            })
            }
        })
        },
    })

    const handlePictureDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const fileUrl = URL.createObjectURL(file);
        formik.setFieldValue('picture', fileUrl);
      };
    
      const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handlePictureDrop,
        accept: 'image/*',
        multiple: false,
      });


  return ( 
    <div className="flex items-center justify-center h-screen" >
      <div className="w-102 bg-blue shadow-lg rounded-lg px-8 py-6">
        <h2 className="text-2xl text-blue-900 font-bold mb-4">Create a new course!</h2>
        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
            <div>
                <Typography id='silly-forms' sx={{ fontSize: 20 }} color="secondary">
                    Title
                </Typography>

                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    className={`w-full px-3 py-2 border mb-2 rounded focus:outline-none focus:border-blue-500 ${
                        formik.errors.title && formik.touched.title ? 'border-red-500' : 'border-blue-300'
                      }`}
                    />
                    {formik.errors.title && formik.touched.title && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
                    )}
                
            </div>
                <Typography id='silly-forms' sx={{ fontSize: 20 }} color="secondary">
                    Category
                </Typography>
               

                <select
                    id="silly-forms"
                    name="category"
                    onChange={formik.handleChange}
                    value={formik.values.category}
                    className={`w-full px-3 py-2 border mb-2 rounded focus:outline-none ${
                    formik.errors.category && formik.touched.category ? 'border-red-500' : 'border-blue-300'
                    }`}
                >
                    <option value="">Pick a Category</option>
                    <option value="Development">Development</option>
                    <option value="Business">Business</option>
                    <option value="Finance">Finance</option>
                    <option value="Design">Design</option>
                    <option value="IT&Software">IT&Software</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Health & fitness">Health & fitness</option>
                    <option value="Music">Music</option>
                    <option value="Lifestyle">Lifestyle</option>
                </select>

                {formik.errors.category && formik.touched.category && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.category}</p>
                )}

                <Typography id="silly-forms" sx={{ fontSize: 20 }} color="secondary">
                    Image
                </Typography>

                <div
                {...getRootProps()}
                className={`w-full px-3 py-2 border mb-2 flex justify-center rounded focus:outline-none focus:border-blue-500 ${
                    formik.errors.picture && formik.touched.picture ? 'border-red-500' : 'border-blue-300'
                    } ${isDragActive ? 'border-blue-500' : ''}`}
                >
                <input {...getInputProps()} />
                {formik.values.picture ? (
                    <img src={formik.values.picture} alt="Dropped Image" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                ) : isDragActive ? (
                    <p>Drop the file here...</p>
                ) : (
                    <p>Drag and drop an image here, or click to select an image</p>
                )}
                </div>

                {formik.errors.picture && formik.touched.picture && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.picture}</p>
                )}
                
                <Typography id='silly-forms' sx={{ fontSize: 20 }} color="secondary">
                    Description
                </Typography>
                <textarea 
                    type='text' 
                    rows='4' 
                    cols='50' 
                    name='description' 
                    value={formik.values.description} 
                    onChange={formik.handleChange} 
                    className={`w-full px-3 py-2 border  rounded focus:outline-none focus:border-blue-500 ${
                        formik.errors.description && formik.touched.description ? 'border-red-500' : 'border-blue-300'
                      }`}
                    />
                    {formik.errors.picture && formik.touched.picture && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>
                    )}
            
                <div className="flex justify-center mt-6">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full w-48 hover:bg-blue-500">
                    Submit
                </button>
                </div>
            </form>
        </div>
        </div>
  )
}
  
export default CreateCourseForm

