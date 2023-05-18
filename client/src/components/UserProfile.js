import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useContext } from 'react'
import { UserContext } from '../UserContext'


const UserProfile = () => {
    const { userId, setUserId } = useContext(UserContext) 

    const { user, isLoading } = useAuth0();
    // const [nickname, setNickname] = useState('');
    // const [picture, setPicture] = useState('');
   
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
        <>
          {/* {isAuthenticated && (
            <div>
              <h2>User Profile</h2>
              {userId && (
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="nickname">Nickname</label>
                    <input
                      type="text"
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="picture">Picture</label>
                    <input
                      type="text"
                      id="picture"
                      value={picture}
                      onChange={(e) => setPicture(e.target.value)}
                    />
                  </div>
                  <button type="submit">Update Profile</button>
                </form>
              )}
            </div>
          )} */}
        </>
      );

}


export default UserProfile