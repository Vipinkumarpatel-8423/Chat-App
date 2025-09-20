import cloudinary from "../lib/cloudinary.js";
import { genrateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"

//signup a new user

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" })
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "Account already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      fullName, email, password: hashedPassword, bio
    })

    const token = genrateToken(newUser._id)
    res.json({ success: true, userData: newUser, token, message: "Account Created Successfully.." })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

// Controller to login a user

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    // extra code
    // if (!email || !password) {
    //   return res.status(400).json({ success: false, message: "Email and password are required." })
    // }
    // till that
    const userData = await User.findOne({ email })
    console.log(userData, "userData")
    const isPasswordCurrect = await bcrypt.compare(password, userData.password)

    if (!isPasswordCurrect) {
      return res.json({ success: false, message: "Invalid Credentials" })
    }
    const token = genrateToken(userData._id)
    res.json({ success: true, userData, token, message: "Login successfully." })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}


//Controller to check if user is authenticated

export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user })
}

//Controller to update user profile details

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;
    let updatedUser;
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName },
        { new: true })
    } else {
      const upload = await cloudinary.uploader.upload(profilePic)
      updatedUser = await User.findByIdAndUpdate(userId,
        { profilePic: upload.secure_url, bio, fullName }, { new: true });
    }
    res.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.json({ success: false, message: error.message })
  }
}