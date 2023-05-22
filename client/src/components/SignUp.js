import { useAuth0 } from "@auth0/auth0-react"

function SignUp() {
    const { loginWithRedirect } = useAuth0();
    return <button className="text-white font-bold hidden md:flex  hover:bg-blue-700 px-3 py-2 rounded-full text-lg " onClick={() => loginWithRedirect()}>Log In</button>;
}

export default SignUp