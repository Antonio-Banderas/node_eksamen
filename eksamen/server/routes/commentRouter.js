import { Router } from "express";
import db from "../database/createConnection.js"

const commentRouter = Router();


// POST //
commentRouter.post("/api/comments/:uuid", async (req, res) => {

    if (!req.session.username) {
        return res.sendStatus(401);
    }

    const { user, body } = req.body
    const uuid = req.params.uuid

    const response = await db.posts.updateOne({ "uuid": uuid },
        { $push: { "comments": { "user": user, "body": body } } })

    if (response.modifiedCount) {
        res.sendStatus(201)
    } else { res.sendStatus(400) }
})

export { commentRouter }