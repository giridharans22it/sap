const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const fs = require('fs');

const app = express();
const port = 3000;

// MongoDB Connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Middleware for parsing JSON and urlencoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle POST request
app.post('/', upload.array('proofFile'), async (req, res) => {
    try {
        await client.connect();
        const database = client.db('SAP');
        const collection = database.collection('Data');

        const eventData = {
            rollno: req.body.rollno,
            eventType: req.body.sap_type,
            eventOption: req.body[req.body.sap_type.toLowerCase() + '_options'],
            points: req.body.points,
            imageName: req.files.map(file => file.originalname),
            institutionName: req.body.institution_name
        };

        // Insert data into MongoDB
        await collection.insertOne(eventData);

        res.status(200).send('Data inserted into MongoDB');
    } catch (err) {
        console.error('Error inserting data into MongoDB:', err);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${ port }`);
});