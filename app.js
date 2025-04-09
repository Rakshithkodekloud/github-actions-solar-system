const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

let isDbConnected = false;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err) {
    if (err) {
        console.log("MongoDB connection error: " + err);
    } else {
        console.log("MongoDB connected");
        isDbConnected = true;
    }
});

const Schema = mongoose.Schema;

const dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});

const planetModel = mongoose.model('planets', dataSchema);

// Planet endpoint
app.post('/planet', function(req, res) {
    if (!isDbConnected) {
        return res.status(500).send("Database connection error");
    }

    planetModel.findOne({ id: req.body.id }, function(err, planetData) {
        if (err) {
            console.error("Error querying DB: " + err);
            res.status(500).send("Error retrieving planet data");
        } else if (!planetData) {
            res.status(404).send("Planet not found");
        } else {
            res.send(planetData);
        }
    });
});

// Static and info routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/os', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV
    });
});

app.get('/live', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({ "status": "live" });
});

app.get('/ready', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({ "status": "ready" });
});

app.listen(3000, () => {
    console.log("Server successfully running on port - 3000");
});

module.exports = app;
