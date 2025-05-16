import { useNavigate } from "react-router-dom";

export default function Home() {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-[200px] justify-center items-center bg-[#1E1E1E] min-h-screen">
            <h1 className="bg-gradient-to-b from-slate-50 to-neutral-500 bg-clip-text text-transparent font-bold text-[228.47px] ">Type Sprint</h1>
            <button 
                className="border px-[213px] py-2 rounded-[40px] text-white transition duration-300 ease-in-out hover:text-[#1E1E1E] hover:bg-white"
                onClick={() => navigate('/dashboard')}
            >
                Start
            </button>
        </div>
    )
}
  