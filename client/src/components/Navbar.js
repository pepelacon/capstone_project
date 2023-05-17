import { Link, useParams, useNavigate } from "react-router-dom"
import SignUp from './SignUp';
import SignOut from './SignOut';

import { useAuth0 } from "@auth0/auth0-react"



function NavBar() {
    const {user, isAuthenticated} = useAuth0()  

function handleChange(e) {
    console.log(e.target.value)
}





    return(
       
        <nav className="bg-blue-800 ">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center flex-wrap justify-between w-full h-16">
            <div className="flex items-center w-1/4">
                <Link to="/" className="text-white font-bold text-xl">
                SkillMentor
                </Link>
            </div>
            <div className="flex justify-center w-1/2">
                <input className="w-full bg-white text-gray-800 rounded-md px-4 py-2 mr-4 focus:outline-none" type="text" placeholder="Search..." onChange={handleChange} />
            </div>
            <div className="flex items-center justify-end w-1/4">
                <Link to="/create_course" className="text-gray-300 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Create course</Link>
                <Link to="#" className="text-gray-300 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">My Courses</Link>
                <a href="#" className="text-gray-300 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">{!isAuthenticated ? <SignUp /> : <SignOut />}</a>
            </div>
            </div>
        </div>
        </nav>
    )
}

export default NavBar;