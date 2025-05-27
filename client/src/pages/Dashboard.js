import UpperNav from "../components/UpperNav.js"
import LowerNav from "../components/LowerNav.js"
import Title from "../components/Title.js"
import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext.js'

export default function Dashboard() {
    const { auth } = useContext(AuthContext)

    return (
        <div className="relative min-h-screen bg-black flex flex-col">
            <UpperNav auth={auth} />
            <div className="flex-1 flex flex-col justify-center items-center -mt-24">
                <Title />
            </div>
            <LowerNav />
        </div>
    )
}
