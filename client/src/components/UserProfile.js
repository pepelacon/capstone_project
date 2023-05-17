import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'

import { Link } from "react-router-dom"
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { amber } from '@mui/material/colors';



const UserProfile = ({setUserId, userId}) => {

    const { user, isAuthenticated, isLoading } = useAuth0();
    
    console.log(user);

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