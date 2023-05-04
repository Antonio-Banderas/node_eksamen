import { Router } from "express";
import { v4 as uuidv4 } from 'uuid';
import db from "../database/createConnection.js"
import formidable from "formidable";
import path from "path";
import fs from "fs";
import ogs from "open-graph-scraper";

const postRouter = Router();

// GET //
// get all posts
postRouter.get("/api/posts", async (req, res) => {
    const postsFromDB = await db.posts.find().toArray()

    postsFromDB.forEach(post => {
        delete (post._id)
    });

    res.send({ data: postsFromDB })
})

// GET //
// get one post
postRouter.get("/api/posts/:uuid", async (req, res) => {

    const uuid = req.params.uuid

    const postFromDB = await db.posts.findOne({ "uuid": uuid })
    delete postFromDB._id;

    res.send({ data: postFromDB })
})


// POST //
// 3 different post types exsists: plain, file, link
postRouter.post("/api/posts", async (req, res) => {

    if (!req.session.username){
        return res.sendStatus(401);   
    }

    // Create a new formidable instance
    const form = formidable({ multiples: true });

    // Parse the incoming form data
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        }

        // Input from frontend for every post
        const { postType, title, user } = fields;

        // File (image, video, audio)
        if (postType === 'file') {

            const { file } = files;
            const oldPath = file.filepath;

            // New unique file name + its extension
            const fileName = uuidv4() + path.extname(file.originalFilename)

            const newPath = path.join(__dirname, '../client/public/uploads/' + fileName)

            const rawData = fs.readFileSync(oldPath)

            fs.writeFile(newPath, rawData, function (err) {
                if (err) console.log(err)
            })

            await insertIntoDb(null, null, fileName)
        }

        // plaintext
        if (postType === 'text') {

            const body = fields.body;
            await insertIntoDb(body, null, null);
        }

        // link (open graph protocol)
        if (postType === 'link') {

            const options = { url: fields.link };

            let ogData = {};
            const data = await ogs(options)
                .then((data) => {
                    const { error, result, response } = data;

                    ogData.ogUrl = result.ogUrl
                    ogData.ogSiteName = result.ogSiteName
                    ogData.ogTitle = result.ogTitle
                    ogData.ogDescription = result.ogDescription
                    ogData.ogImageUrl = result.ogImage.url

                }).catch((error) => {
                    console.error(error);
                });

            await insertIntoDb(null, ogData, null)
        }

        // depending on which postType, insert it into db
        async function insertIntoDb(body, ogData, fileName) {

            // Unique ID for post
            const uniqueID = uuidv4()

            const response = await db.posts.insertOne({
                postType,
                uuid: uniqueID,
                title,
                body,
                user,
                ogData: ogData,
                file: fileName,
                comments: [],
            });

            if (response.insertedId) {
                res.status(201).json({
                    postType: postType,
                    uuid: uniqueID,
                    title,
                    body,
                    user,
                    ogData: ogData,
                    file: fileName,
                    comments: [],
                });
            } else {
                res.sendStatus(500);
            }
        }
    });
});




// --- DELETE --- //

export { postRouter }
