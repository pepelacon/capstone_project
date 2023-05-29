import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useContext, useState } from 'react'
import { UserContext } from '../UserContext'
import { useNavigate } from 'react-router-dom';
import { HiTrash } from "react-icons/hi"
import { RxGear } from "react-icons/rx"
import Settings from './Settings';




const UserProfile = () => {
    const { userId, setUserId } = useContext(UserContext) 
    const [showSettings, setShowSettings] = useState(false);
    const { user, isLoading, logout  } = useAuth0();
    const navigate = useNavigate()


    const handleDelete = () =>{
        try {fetch(`/user/${userId.id}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (response.ok){
                logout({ logoutParams: { returnTo: window.location.origin } })
                navigate('/')
            }})
        } catch (error) {
            console.error('Error occurred during deleting user:', error);
        }
    }

    useEffect(() => {
        async function createUser() {
            try {
                const response = await fetch('/profile', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: user.name,
                        email: user.email,
                        nickname: user.nickname,
                        avatar: user.picture
                    })
            });
                const data = await response.json();
                setUserId(data);
            } catch (error) {
                console.error(error);
            }
        }
        if (user && !userId) {
            createUser();
        }
        }, [user, userId]);

    if(isLoading){
        return <div>Loading!</div>
    }
    
    const formattedDate = userId ? new Date(userId.created_at).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : '';
    
    const toggleSettings = () => {
      setShowSettings(!showSettings);
    };
// update profile   
    return (
      <>
        {userId && (
          <div className="max-w-md mx-auto bg-white my-12 shadow-md overflow-hidden">
            <div className="flex items-center space-x-4 p-4">
              <img
                className=" object-cover"
                style={{ maxWidth: '100%', maxHeight: '100px' }}
                src={userId.avatar}
                alt="Profile"
              />
              <div>
                <h2 className="text-lg font-semibold">{userId.nickname}</h2>
                <p className="text-gray-600">Account email: {userId.email}</p>
              </div>
            </div>

            <div className="bg-gray-100 px-4 py-2">
              <p className="text-sm text-gray-500">Joined: {formattedDate}</p>
            </div>

            <div className="flex justify-between px-4 py-2">
              <button
                className="p-2 border-0 rounded-full hover:bg-gray-300"
                onClick={toggleSettings} 
              >
                <RxGear size={25} />
              </button>
              <button className="p-2 border-0 rounded-full hover:bg-gray-300" onClick={handleDelete}>
                <HiTrash size={25} />
              </button>
            </div>
            {showSettings && <Settings setShowSettings={setShowSettings} />}
          </div>
        )}
      </>
    );

}


export default UserProfile