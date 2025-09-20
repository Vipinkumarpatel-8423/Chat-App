import express from "express"
import { protectRoute } from "../middleware/auth.js"
import { getallMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js"

const messageRouter = express.Router()

messageRouter.get("/user", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getallMessages)
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen)
messageRouter.post("/send/:id", protectRoute, sendMessage)
export default messageRouter;