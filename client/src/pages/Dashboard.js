import LowerNav from "../components/LowerNav.js"
import Title from "../components/Title.js"

export default function Dashboard() {

    return (
        <div className="relative min-h-screen bg-black flex flex-col">
            <div className="flex-1 flex flex-col justify-center items-center">
                <Title />
            </div>
            <LowerNav />
        </div>
    )
}
