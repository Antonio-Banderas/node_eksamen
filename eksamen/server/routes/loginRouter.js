import { Router } from "express";
import { compare } from "bcrypt"
import db from "../database/createConnection.js"

const loginRouter = Router();

// POST //
// login
loginRouter.post("/api/login", async (req, res) => {

    const { email, password } = req.body;
    const userToAuthorize = await db.users.findOne({ email: email })

    if (userToAuthorize) {

        const isValid = await compare(password, userToAuthorize.password)

        if (isValid) {

            const userFavorites = userToAuthorize.favorites
            req.session.username = userToAuthorize.username
            res.send({ user: req.session.username, userFavorites })

        } else {
            res.sendStatus(400)
        }
    } else {
        res.sendStatus(400)
    }
})



// POST //
// logout
loginRouter.post("/api/logout", async (req, res) => {
    if (req.session.username) {
        delete req.session.username
        res.sendStatus(200)
    } else { res.sendStatus(400) }
})

export { loginRouter }