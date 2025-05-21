import { useNavigate } from "react-router-dom"

export default function Dashboard() {

    const navigate = useNavigate();

    return (
        <div>
            {/* UPPER NAV */}
            <nav class="bg-black">
                <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div class="relative flex h-16 items-center justify-between">
                        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <button type="button" class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset" aria-controls="mobile-menu" aria-expanded="false">
                                <span class="absolute -inset-0.5"></span>
                                <span class="sr-only">Open main menu</span>

                                <svg class="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>

                                <svg class="hidden size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div class="hidden sm:ml-6 sm:block">
                                <div class="flex space-x-4">

                                    <a href="/dashboard" class="rounded-md bg-[#F2F8FF] px-3 py-2 text-sm font-medium text-black" aria-current="page">PLAY</a>
                                    <a href="/dashboard" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">FRIENDS</a>
                                    <a href="/dashboard" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">RECORDS</a>
                                </div>
                            </div>
                        </div>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <div class="relative ml-3">
                                <div>
                                    <button type="button" class="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                        <span class="absolute -inset-1.5"></span>
                                        <span class="sr-only">Open user menu</span>
                                        <img class="size-8 rounded-full" src="https://i.pinimg.com/736x/ed/de/89/edde897bf47591b076ebea01ca370bc8.jpg" alt="" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div class="sm:hidden" id="mobile-menu">
                    <div class="space-y-1 px-2 pt-2 pb-3">

                        <a href="#" class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Dashboard</a>
                        <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
                        <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>
                        <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
                    </div>
                </div> */}
            </nav>
            <div className="flex flex-col gap-[200px] justify-center items-center bg-[black] min-h-screen">

                <h1 className="bg-gradient-to-b from-slate-50 to-neutral-500 bg-clip-text text-transparent font-bold text-[228.47px] ">Type Sprint</h1>

            </div>
            {/* LOWER NAV */}
            <nav>
                {/* TODO */}
            </nav>
        </div>
    )
}
