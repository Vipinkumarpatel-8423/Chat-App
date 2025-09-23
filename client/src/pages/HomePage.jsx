import Sidebar from "../components/Sidebar"
import ChatContainer from "../components/ChatContainer"
import RightSideBar from "../components/RightSidebar"
import { useContext } from "react";
import ChatContext from "../../context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext)
  return (
    <div className="border md:h-screen w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div className={`backdrop-blur-xl border-2 border-grey-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]" : "md:grid-cols-2"}`}>
        <Sidebar />
        <ChatContainer />
        <RightSideBar />
      </div>

    </div >
  )
}
export default HomePage




// new code for chatgpt

// import Sidebar from "../components/Sidebar"
// import ChatContainer from "../components/ChatContainer"
// import RightSideBar from "../components/RightSidebar"
// import { useContext, useState } from "react";
// import ChatContext from "../../context/ChatContext";

// const HomePage = () => {
//   const { selectedUser } = useContext(ChatContext);
//   const [showRightSidebar, setShowRightSidebar] = useState(false);

//   return (
//     <div className="border w-full h-full  sm:px-[15%] sm:py-[5%]">
//       <div className={`backdrop-blur-xl border-2 border-grey-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative
//         ${selectedUser ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]" : "md:grid-cols-2"}`}>

//         {/* Sidebar */}
//         <div className={`${selectedUser ? "hidden md:block" : "block"} h-full`}>
//           <Sidebar />
//         </div>

//         {/* ChatContainer (pass setShowRightSidebar as prop) */}
//         <div className={`${selectedUser ? "block" : "hidden md:block"} h-full`}>
//           <ChatContainer onShowRightSidebar={() => setShowRightSidebar(true)} />
//         </div>

//         {/* RightSidebar Desktop */}
//         <div className="hidden md:block h-full">
//           <RightSideBar onClose={() => setShowRightSidebar(false)} />
//         </div>
//       </div>

//       {/* RightSidebar Mobile (overlay) */}
//       {showRightSidebar && (
//         <div className="fixed inset-0 z-50 bg-black/70 flex">
//           <div className="w-full bg-[#1a1a2e] p-4 overflow-y-scroll">
//             <button
//               onClick={() => setShowRightSidebar(false)}
//               className="text-white mb-3"
//             >
//               ❌ Close
//             </button>
//             <RightSideBar onClose={() => setShowRightSidebar(false)} />
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
// export default HomePage;
