import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SignOut from './SignOut';
import { AiOutlineMenu } from 'react-icons/ai'
import Divider from '@mui/material/Divider';




const DropdownMenu = ({userId, role}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    
    useEffect(() => {
        const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
        };
    
        document.addEventListener('mousedown', handleOutsideClick);
    
        return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);
    
    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-full text-white hover:bg-blue-700 px-3 py-2 font-bold"
                    onClick={toggleDropdown}
                >
                <AiOutlineMenu size={25} />
                </button>
            </div>
    
        {isOpen && (
            <div className="origin-top-right absolute right-0 mt-3 w-60 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-10 z-50">
                <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <div className="flex items-center space-x-2 p-2 my-2">
                        <img
                        className="w-16 h-16 rounded-full object-cover"
                            src={userId.avatar}
                            alt="Profile"
                        />
                        <div>
                        <h2 className="text-sm font-semibold">{userId.name}</h2>
                        <p className="text-gray-600 text-lg">{userId.nickname}</p>
                        </div>
                    </div>
                    <Divider />
                    <Link to="/profile" className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100" role="menuitem">
                        Account settings
                    </Link>
                    { role === 'student' ?
                        <Link to="/my_learning" className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100" role="menuitem">
                            My Learning
                        </Link> : 
                        <>
                            <Link
                                to="/create_course"
                                className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                            >
                                Create Course
                            </Link>
                            <Link
                                to="/instructor_courses"
                                className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                            >
                                Your courses
                            </Link>
                        </>
                    }
                    <Divider />
                    <a href="#"  role="menuitem">
                        <SignOut />
                    </a>
                </div>
            </div>
        )}
        </div>
    );
    };
    
    export default DropdownMenu;
