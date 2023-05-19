import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useContext } from 'react'
import { UserContext } from '../UserContext'
import { useNavigate } from 'react-router-dom';



const UserProfile = () => {
    const { userId, setUserId } = useContext(UserContext) 

    const { user, isLoading } = useAuth0();
    const navigate = useNavigate()

    // const [nickname, setNickname] = useState('');
    // const [picture, setPicture] = useState('');
   console.log(user);
// # create new User in DB if it existed just return existing values back
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
        }, [user]);

    if(isLoading){
        return <div>Loading!</div>
    }
    
    const formattedDate = userId ? new Date(userId.created_at).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : '';
    
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //     const response = await fetch(`/profile/${userId}`, {
    //         method: 'PATCH',
    //         headers: {
    //         'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //         nickname,
    //         avatar: picture,
    //         }),
    //     });
    //     const data = await response.json();
    //     setUserId(data);
    //     } catch (error) {
    //     console.error(error);
    //     }
    // };


// update profile   
    return (
      <> { userId && 
        (  <div className="max-w-md mx-auto bg-white mt-8 shadow-md rounded-md overflow-hidden">
          <div className="flex items-center space-x-4 p-4">
            <img
              className="w-16 h-16 rounded-full object-cover"
              src={userId.avatar}
              alt="Profile"
            />
            <div>
              <h2 className="text-lg font-semibold">{userId.name}</h2>
              <p className="text-gray-600">{userId.email}</p>
            </div>
          </div>
          <div className="px-4 py-2">
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              aliquet ex ut justo ullamcorper malesuada. Curabitur tincidunt
              tristique ipsum, id feugiat nunc euismod sed.
            </p>
          </div>
          <div className="bg-gray-100 px-4 py-2">
            <p className="text-sm text-gray-500">
              Joined: {formattedDate}
            </p>
          
          </div>
          <button onClick={() => navigate('/settings')}>Settings</button>
        </div>)}
      </>
      )

}


export default UserProfile