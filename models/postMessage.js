const dynamoose = require("dynamoose");
//id, title, message,  creator, tags, selectedFile
const postSchema = new dynamoose.Schema({
    id: Number,
    title: String,
    message: String,
    creator: String,
    tags: {
        type: Set,
        schema: [String]
    },
    selectedFile: String,
    likeCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
const PostMessage = dynamoose.model('blogs', postSchema);

module.exports = PostMessage;