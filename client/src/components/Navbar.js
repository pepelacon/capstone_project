import { Link } from "react-router-dom"
import SignUp from './SignUp';
import DropdownMenu from "./DropdownMenu";
import { useAuth0 } from "@auth0/auth0-react"
import { AiOutlineSearch } from 'react-icons/ai'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';





function NavBar({userId}) {
    const { isAuthenticated } = useAuth0()
    const [role, setRole] = useState('student')  
    const navigate = useNavigate()


    function handleChange(e) {
        console.log(e.target.value)
    }

    function handleRoleChange(newRole) {
        setRole(newRole);
        newRole === 'student' ? navigate('/') : navigate('/instructor_courses')
    }

    return(
            <div className=" bg-blue-900 w-full mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center flex-wrap justify-between w-full h-16">

                    <div className="hidden lg:flex items-center w-1/4 ">
                        { role === "student" ? 
                            <Link to="/" className="text-white text-xl sm:text-2xl lg:text-3xl px-2">
                                Skill<span className="font-bold">Factory</span>
                            </Link> :
                            <Link to="/instructor_courses" className="text-white text-xl sm:text-2xl lg:text-3xl px-2">
                                Skill<span className="font-bold">Factory</span>
                            </Link>
                        }
                        
                    </div>
                    
                    <div className="flex mx-auto bg-gray-200 rounded-full items-center px-2 sm:w-1/2 lg:w-1/2">
                        <AiOutlineSearch size={30}/>
                        <input className="bg-transparent p-2 w-full focus:outline-none" type="text" placeholder="Search..." onChange={handleChange} />
                    </div>

                    <div className="hidden lg:flex items-center justify-end w-1/4">
                        <div className="hidden lg:flex items-center bg-gray-200 rounded-full p-1 text-[14px] mr-6">
                            { isAuthenticated && 
                                <>
                                    <p className={`${ role === 'instructor' ? 'bg-black text-white' : 'bg-gray-200'} rounded-full p-2 cursor-pointer`} onClick={() => handleRoleChange('instructor')}>
                                        Instructor
                                    </p>
                                    <p
                                    className={`${role === 'student' ? 'bg-black text-white' : 'bg-gray-200'} rounded-full p-2 cursor-pointer`} onClick={() => handleRoleChange('student')}>
                                        Student
                                    </p>
                                </> }     
                        </div>
                            {isAuthenticated ? ( 
                                <>
                                    <DropdownMenu userId={userId} role={role}/>
                                </>
                                ) : (
                                    <a href="#" > <SignUp /></a>
                                    
                                )}
                    </div>

                </div>

            </div>
      
    )
}

export default NavBar;