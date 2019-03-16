const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const mongoose = require('mongoose');

const Errors = require('./errors/Errors')
const main = require('./routes/main');

require('dotenv').config();
mongoose.connect(
        process.env.DB_URL, 
        { useNewUrlParser: true }
);

if(!process.env.ENV)
    app.use(logger("DEV"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Routes
app.use('/', main);

app.use((err, req, res, next) => {
    if (err instanceof Errors.BaseError)
        res.status(err.status).json(err.error);
});

const server = http.createServer(app);
const port = process.env.PORT;

server.listen(port, () => {
    console.log(`Listening to port: ${port}`);
});