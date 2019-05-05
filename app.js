const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const port = process.env.PORT || 3000;
const app = express();
const exphbs = require('express-handlebars');
// const mongoose = require('mongoose');

const Errors = require('./errors/Errors')
const main = require('./routes/main');

require('dotenv').config();
// mongoose.connect(
//         process.env.DB_URL, 
//         { useNewUrlParser: true }
// );

// if(!process.env.ENV)
//     app.use(logger("DEV"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Routes
app.use('/', main);

app.use((err, req, res, next) => {
    console.log(err);
    if (err instanceof Errors.BaseError)
        res.status(err.status).json(err.error);
});

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Listening to port: ${port}`);
});