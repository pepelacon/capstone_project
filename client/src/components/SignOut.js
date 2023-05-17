import { useAuth0 } from "@auth0/auth0-react"


function SignOut() {

    const { logout } = useAuth0();
    return <button className='out' onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log Out</button>}

export default SignOut