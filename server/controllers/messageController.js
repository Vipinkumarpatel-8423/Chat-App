import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js"

//get all users except the logged in user

export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id
    const filterdUsers = await User.find({ _id: { $ne: userId } }).select("-password")
    const unseenMessages = {}
    const promises = filterdUsers.map(async (user) => {
      const message = await Message.find({ senderId: user._id, receiverId: userId, seen: false })
      if (message.length > 0) {
        unseenMessages[user._id] = message.length;
      } else {
        unseenMessages[user._id] = 0
      }
    })
    await Promise.all(promises);
    res.json({ success: true, users: filterdUsers, unseenMessages })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }

}

// Get all message for select user

export const getallMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id

    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId }
      ]
    })
    await Message.updateMany({
      senderId: selectedUserId, receiverId: myId
    }, { seen: true })
    res.json({ success: true, message })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

// api to mark message as seen ussing message id

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true }, { new: true })
    res.json({ success: true })
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message })
  }
}

// Send message to selected User

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await Message.create({
      senderId, receiverId, image: imageUrl, text
    })

    //emit the new message to receiver's socket 
    const receiverSocketId = userSocketMap[receiverId]
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.json({ success: true, newMessage })

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message })
  }

}









// auto create code
// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image, senderId, receiverId } = req.body;
//     const newMessage = await Message.create({ text, image, senderId, receiverId });
//     res.json({ success: true, message: newMessage });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// }

// export const getMessages = async (req, res) => {
//   try {
//     const { senderId, receiverId } = req.query;
//     const messages = await Message.find({ senderId, receiverId }).sort({ createdAt: -1 });
//     res.json({ success: true, messages });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// }

// export const updateMessageSeen = async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     const updatedMessage = await Message.findByIdAndUpdate(messageId, { seen: true }, { new: true });
//     res.json({ success: true, message: updatedMessage });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// }

