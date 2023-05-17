import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState, useContext } from 'react'
import { UserContext } from '../UserContext'






const UserProfile = () => {
    const { userId, setUserId } = useContext(UserContext) 
    const { user, isAuthenticated, isLoading } = useAuth0();
   

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
                setUserId(data.id);
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

    return (
        <>
            {isAuthenticated ? (<h1>This is profile page</h1>) : (<h1>Not aiuthonticated</h1>)}
        </>
        
       
    )

}


export default UserProfile