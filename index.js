// index.js
let postRouter = require("./routes/postRoutes");
const dynamoose = require("dynamoose");
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express();
let cognitoAuth = require("./lib/verifyMiddleware");
const PostMessage = require("./models/postMessage");
const cors = require('cors');

app.use(bodyParser.json({strict: false}));
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors());
app.options('*', cors());
try {
    console.log(process.env.accessKeyId);
    dynamoose.aws.sdk.config.update({
        "accessKeyId": process.env.accessKeyId,
        "secretAccessKey": process.env.secretAccessKey,
        "sessionToken": process.env.sessionToken,
        "region": "us-east-1"
    });
    console.log("Connected successfully");
} catch (err) {
    console.log("Error connecting");
}


app.get('/', function (req, res) {
    res.send('Welcome to PARSS!');
})

app.get('/posts', async (req, res) => {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET,PUT,PATCH");
    console.log("Router is working");
    try {
        const results = await PostMessage.scan().exec();
        res.send(results);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

app.get('/posts/:id', async (req, res) => {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET,PUT,PATCH");
    let {id} = req.params;
    console.log("Router is working");
    try {
        const results = await PostMessage.query("id").eq(parseInt(id, 10)).exec();
        let response = {};
        response.status = 200;
        response.data = results;
        res.send(results);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

const cognitoAuthMiddleWare = cognitoAuth.getVerifyMiddleware();

app.use('/posts', cognitoAuthMiddleWare, postRouter);

module.exports.handler = serverless(app);