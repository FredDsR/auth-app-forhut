const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const auth = require('./auth.js');

require('dotenv').config();

const app = express();

const server = require('http').Server(app);

console.log(process.env.DB_CONNECTION);
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => {
    console.log('Error mogoose conection: ' + err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(auth().initialize());

app.use(cors());

app.use(require('./routes'));

server.listen(process.env.PORT || 8080);
