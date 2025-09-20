import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import ChatContext from '../../context/ChatContext';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);

  const { logout, onlineUser, authUser } = useContext(AuthContext)

  const navigate = useNavigate();

  const [input, setInput] = useState("");

  // const filteredUsers = input ? users.filter((user) =>
  //   user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

  const filteredUsers = input
    ? (users || []).filter((u) =>
      u._id !== authUser._id && u.fullName?.toLowerCase().includes(input.toLowerCase())
    )
    : (users || []).filter((u) => u._id !== authUser._id);


  useEffect(() => {
    getUsers();
  }, [onlineUser])

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "mx-md:hidden" : ""}`}>
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="log" className='max-w-40' />
          <div className='relative py-2 group'>
            <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
              <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={() => logout()} className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>

        {/* Search Bar  */}
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assets.search_icon} alt="Search" className='w-3' />
          <input onChange={(e) => setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search User...' />
        </div>
      </div>
      {/* User List */}
      <div className='flex flex-col gap-3'>
        {filteredUsers.map((user, index) => (
          <div onClick={() => {
            setSelectedUser(user);
            setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
          }}
            key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded-full cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && "bg-[#282142]/50"}`}>
            <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] rounded-full' />
            <div className='flex flex-col leading-5 px-3'>
              <p>{user.fullName}</p>
              {
                onlineUser.includes(user._id)
                  ? <span className='text-green-400 text-xs'>Online</span>
                  : <span className='text-neutral-400 text-xs'>Ofline</span>
              }

              {/* {
                Array.isArray(onlineUser) && user?._id
                  ? (onlineUser.includes(user._id)
                    ? <span className='text-green-400 text-xs'>Online</span>
                    : <span className='text-neutral-400 text-xs'>Offline</span>
                  )
                  : <span className='text-neutral-400 text-xs'>Offline aa</span>
              } */}
            </div>
            {
              unseenMessages[user._id] > 0 && <p className="absolute top-4 right-1 text-xs h-4 w-4 flex justify-center items-center rounded-full bg-violet-500/50">{unseenMessages[user._id]}</p>
            }
          </div>
        ))}
      </div>
    </div >
  )
}
export default Sidebar;