const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();

const users = require('./routes/users');

require('dotenv').config();

if(!process.env.ENV)
    app.use(logger("DEV"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Routes
app.use('/users', users);

app.use((err, req, res, next) => {
    console.log(err);
});

const server = http.createServer(app);
const port = process.env.PORT;

server.listen(port, () => {
    console.log(`Listening to port: ${port}`);
});