import UpperNav from "../components/UpperNav.js"
import LowerNav from "../components/LowerNav.js"
import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext.js'

export default function Dashboard() {
    const { auth } = useContext(AuthContext)

    return (
        <div>
            <UpperNav auth={auth} />
            <div className="flex flex-col gap-[200px] justify-center items-center bg-[black] min-h-screen">

                <h1 className="bg-gradient-to-b from-slate-50 to-neutral-500 bg-clip-text text-transparent font-bold text-[228.47px] ">Type Sprint</h1>

            </div>
            {/* TODO: LOWER NAV */}
            <LowerNav />
        </div>
    )
}
