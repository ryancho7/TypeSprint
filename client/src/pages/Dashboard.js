import LowerNav from "../components/LowerNav.js"
import Title from "../components/Title.js"
import FriendsModal from "../components/FriendsModal.js"
import { useState } from 'react'

export default function Dashboard({ showFriendsModal, setShowFriendsModal }) {
    // State for pagination
    const [page, setPage] = useState(1);

    return (
        <div className="relative flex flex-col flex-1 bg-black">
            <div className="flex-1 flex flex-col justify-center items-center">
                <Title />
            </div>
            <LowerNav />
            
            {/* Friends Modal */}
            <FriendsModal
                open={showFriendsModal}
                onClose={() => setShowFriendsModal(false)}
                page={page}
                totalPages={1}
                onPageChange={(p) => setPage(p)}
            />
        </div>
    )
}