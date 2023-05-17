import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useFormik } from "formik"
import * as yup from "yup"
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import { Link } from "react-router-dom"
import { useAuth0 } from '@auth0/auth0-react'
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';

function CreateCourseForm({userId, setToggle, toggle, allFriends}) {
  const navigate = useNavigate();
  const formSchema = yup.object().shape({
    title: yup.string().required("Must enter a title"),
    budget: yup.number().positive()
  })

  const formik = useFormik({
    initialValues: {
      title:'',
      category:'',
      picture:'',
      description:'',
      instructor_id: userId,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      }).then((res) => {
        if(res.ok) {
          res.json().then(post => {
            setToggle(!toggle)
            navigate(`/`)
          })
        }
      })
    },
  })

  const [state, setState] = useState(true)
  const { user } = useAuth0();
  const [alignment, setAlignment] = useState('your posts');

  const handleList = (newAlignment) => {
      setAlignment(newAlignment);
      setState(!state)
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: blue[800],
      },
    //   secondary: {
    //     main: '#5c6f59',
    //   },
    //   third: {
    //     main: '#757269',
    //   },
    },
  });

  return (
    
    
    <div className="flex items-center justify-center h-screen" >
      <div className="w-96 bg-blue shadow-lg rounded-lg px-8 py-6">
        <h2 className="text-2xl font-bold mb-4">Create a new course!</h2>
        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                />
            </div>
                <Typography id='silly-forms' sx={{ fontSize: 20 }} color="secondary">
                    Category
                </Typography>
                <select
                    id="silly-forms"
                    name="category"
                    onChange={formik.handleChange}
                    value={formik.values.category}
                    className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                >
                    <option value="">Pick a Category</option>
                    <option value="Develompment">Develompment</option>
                    <option value="Business">Business</option>
                    <option value="Finance">Finance</option>
                    <option value="Design">Design</option>
                    <option value="IT&Software">IT&Software</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Health & firness">Health & firness</option>
                    <option value="Music">Music</option>
                    <option value="Lifestyle">Lifestyle</option>
                </select>

                <Typography id='silly-forms' sx={{ fontSize: 20 }} color="text.secondary">
                    Image
                </Typography>
                <input 
                    type='text' 
                    name='image' 
                    value={formik.values.image} 
                    onChange={formik.handleChange} 
                    className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                />
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
                    className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                />
                <div className="flex justify-center mt-6">
                <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                Submit
                </button>
            </div>
            </form>
        </div>
        </div>
  )
}
  
export default CreateCourseForm

