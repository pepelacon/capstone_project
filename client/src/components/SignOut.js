import { useAuth0 } from "@auth0/auth0-react"


function SignOut() {

    const { logout } = useAuth0();
    return <div className='out block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100' onClick={() => logout({ logoutParams: { returnTo: window.location.origin }})}>Log Out</div>}

export default SignOut