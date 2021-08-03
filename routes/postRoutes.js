const express = require('express');
const router = express.Router();
const PostMessage = require("../models/postMessage");

router.post('/', async (req, res) => {
    let postJsonBody = JSON.parse(req.body);
    let title = postJsonBody.title;
    let message = postJsonBody.message;
    let selectedFile = postJsonBody.selectedFile;
    let creator = postJsonBody.creator;
    let tags = postJsonBody.tags;
    let date = new Date();
    let id = date.getTime();
    const newPostMessage = new PostMessage({id, title, message, creator, tags, selectedFile});
    try {
        await newPostMessage.save();
        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
});

router.patch('/:id', async (req, res) => {
    const {id} = req.params;
    let postJsonBody = JSON.parse(req.body);
    let title = postJsonBody.title;
    let message = postJsonBody.message;
    let selectedFile = postJsonBody.selectedFile;
    let creator = postJsonBody.creator;
    let tags = postJsonBody.tags;
    try {
        const updatedPost = new PostMessage({
            creator: creator, title: title,
            message: message, tags: tags,
            selectedFields: selectedFile,
            id: parseInt(id, 10)
        });
        await updatedPost.save();
        res.json(updatedPost);

    } catch (err) {
        console.log(err);
        res.send("Not working!");
    }
})


router.patch('/:id/likePost', async (req, res) => {
    const {id} = req.params;
    console.log(id);
    try {
        let post = await PostMessage.query("id").eq(parseInt(id, 10)).exec();

        console.log(post[0]);
        const updatedPost = new PostMessage({
            creator: post[0].creator, title: post[0].title,
            message: post[0].message, tags: post[0].tags,
            selectedFields: post[0].selectedFields,
            likeCount : post[0].likeCount + 1,
            id: parseInt(id, 10)
        });
        await updatedPost.save();
        res.json(updatedPost);
    } catch (err) {
        console.log(err);
        res.send("Not working!");
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let {id} = req.params;
        console.log(id);
        let Post = await PostMessage.get(parseInt(id, 10));
        console.log(Post);
        await Post.delete();
        res.send("Deleted Successfully");
    } catch (err) {
        res.send("Not working");
    }
});

module.exports = router;