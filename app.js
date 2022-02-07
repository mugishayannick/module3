const express = require("express");
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const messageRoutes = require('./routes/message');
const articleRoutes = require('./routes/article');
const { serve } = require("swagger-ui-express");
const auth = require('./routes/auth');




const dbURI = 'mongodb+srv://Yannick_23:<Yannick23>@cluster0.gjlhj.mongodb.net/node_auth';
mongoose.connect("mongodb://localhost:27017/acmedb", { useNewUrlParser: true })
.then(() => {
    console.log('Successfully connected to Mongoose !');
})
.catch((error) => {
    console.log('Unable to connect to Mongoose !');
    console.error(error);
})



const options = {
    definition: {
        openapi: "3.0.0",
    },
    info: {
        title: "Message API",
        version: "1.0.0",
        description: "A simple express message API"
    },
    servers: [
        {
            url:"http:localhost:8000/"
        }
    ],
    apis: ["./routes/*.js"]
}
const specs = swaggerJsDoc(options)

const app = express()
app.use(express.json());
app.use('/api/message',messageRoutes);
app.use('/api/post',articleRoutes);





app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
app.use('/api/auth', auth);




module.exports = app;