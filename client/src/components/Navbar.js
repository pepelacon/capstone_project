import { Link } from "react-router-dom"
import SignUp from './SignUp';
import DropdownMenu from "./DropdownMenu";
import { useAuth0 } from "@auth0/auth0-react"
import { AiOutlineMenu, AiOutlineSearch } from 'react-icons/ai'



function NavBar({userId}) {
    const { isAuthenticated } = useAuth0()  

function handleChange(e) {
    console.log(e.target.value)
}

    return(
       
        
            <div className=" bg-blue-700 w-full mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center flex-wrap justify-between w-full h-16">

                    <div className="hidden lg:flex items-center w-1/4 ">
                        <Link to="/" className="text-white text-xl sm:text-2xl lg:text-3xl px-2">
                            Skill<span className="font-bold">Factory</span>
                        </Link>
                    </div>
                    
                    <div className="flex mx-auto bg-gray-200 rounded-full items-center px-2 sm:w-1/2 lg:w-1/2">
                        <AiOutlineSearch size={30}/>
                        <input className="bg-transparent p-2 w-full focus:outline-none" type="text" placeholder="Search..." onChange={handleChange} />
                    </div>

                    <div className="hidden lg:flex items-center justify-end w-1/4">
                    {isAuthenticated ? ( 
                        <>
                            <DropdownMenu userId={userId}/>
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