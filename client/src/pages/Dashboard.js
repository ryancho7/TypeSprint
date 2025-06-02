import LowerNav from "../components/LowerNav.js";
import Title from "../components/Title.js";
import FriendsModal from "../components/FriendsModal.js";
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/authContext.js';
import UpperNav from "../components/UpperNav.js";

export default function Dashboard() {
  const { auth } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  return (
    <div className="relative min-h-screen bg-black flex flex-col">
      <UpperNav auth={auth} onFriendsClick={() => setShowModal(true)} />
      <div className="flex-1 flex flex-col justify-center items-center -mt-24">
        <Title />
      </div>
      <LowerNav />
      <FriendsModal
        open={showModal}
        onClose={() => setShowModal(false)}
        page={page}
        totalPages={1}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
