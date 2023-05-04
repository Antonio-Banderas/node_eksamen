import { Router } from "express";
import db from "../database/createConnection.js"

const userRouter = Router();

// PATCH //
userRouter.patch("/api/users/:id", async (req, res) => {

    if (req.session.username !== req.params.id){
        return res.sendStatus(401);   
    }

    const {postUuid, postTitle} = req.body
    const userID = req.params.id

    const response = await db.users.updateOne({ username: userID }, { $addToSet: { favorites: {postUuid, postTitle} } });
    if (response.modifiedCount) {
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

export { userRouter }