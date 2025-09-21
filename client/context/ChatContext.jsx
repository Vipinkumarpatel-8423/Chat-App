import { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import toast from "react-hot-toast";

const ChatContext = createContext()
export default ChatContext;

export const ChatProvider = ({ children }) => {
  const [message, setMessage] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { axios, socket } = useContext(AuthContext)

  // function to get all user sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/message/user")
      if (data.success) {
        setUsers(data.users)
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  //function to get message for selected user

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/message/${userId}`)
      if (data.success) {
        setMessage(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //function to send message to selected user
  const sendMessage = async (messageData) => {
    try {
      //add 
      if (!selectedUser) {
        toast.error("No user selected");
        return;
      }
      // end
      const { data } = await axios.post(`/api/message/send/${selectedUser._id}`, messageData)
      if (data.success) {
        setMessage((prevMessage) => [...prevMessage, data.newMessage])
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // Function to Subscribe to message for selected user
  const subscribeToMessage = async () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        setMessage((prevMessage) => [...prevMessage, newMessage]);
        axios.put(`/api/message/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages, [newMessage.senderId]: prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1

        }))
      }
    })
  }
  // Function to Unsubscribe from message

  const unsubscribeFromMessage = async () => {
    if (socket) socket.off("newMessage");
  }

  useEffect(() => {
    subscribeToMessage();
    return () => unsubscribeFromMessage();
  }, [socket, selectedUser])




  const value = {
    message,
    sendMessage,
    selectedUser,
    setSelectedUser,
    users,
    getMessages,
    getUsers,
    unseenMessages,
    setUnseenMessages,
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}