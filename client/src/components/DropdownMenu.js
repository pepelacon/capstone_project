import { useState} from 'react';
import { Link } from 'react-router-dom';
import SignOut from './SignOut';
import { AiOutlineMenu } from 'react-icons/ai'




const DropdownMenu = () => {
    
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
 
  return (
    <div className="relative inline-block text-left">
        <div>
            <button
                type="button"
                className="inline-flex justify-center w-full rounded-full text-white hover:bg-blue-600 px-3 py-2 font-bold"
                onClick={toggleDropdown}
            >
                <AiOutlineMenu size={25}/>
            </button>
        </div>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                Profile
                            </Link>
                            <Link to="/create_course" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                Create Course
                            </Link>
                            <Link to="/my_learning" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                My Courses
                            </Link>
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                            >
                                <SignOut />
                            </a>
                    </div>
                </div>
            )}
    </div>
  );
};

export default DropdownMenu;
