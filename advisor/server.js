const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection URL
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'sap';
const collectionName = 'students';

// Connect to MongoDB
MongoClient.connect(mongoUrl, (err, client) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static('public'));

    // Routes
    app.get('/view_student', (req, res) => {
        const viewStudentId = req.query.id;
        collection.findOne({ _id: ObjectId(viewStudentId) }, (err, result) => {
            if (err) {
                console.error('Error retrieving student data:', err);
                res.status(500).send('Error retrieving student data');
                return;
            }
            res.json(result);
        });
    });

    app.post('/delete_student', (req, res) => {
        const deleteStudentId = req.body.id;
        collection.deleteOne({ _id: ObjectId(deleteStudentId) }, (err, result) => {
            if (err) {
                console.error('Error deleting student:', err);
                res.status(500).send('Error deleting student');
                return;
            }
            res.send('Student deleted successfully');
        });
    });

    app.post('/update_student', (req, res) => {
        const { id, name, year, department, section, semester } = req.body;
        collection.updateOne(
            { _id: ObjectId(id) },
            { $set: { name, year, department, section, semester } },
            (err, result) => {
                if (err) {
                    console.error('Error updating student:', err);
                    res.status(500).send('Error updating student');
                    return;
                }
                res.send('Student updated successfully');
            }
        );
    });

    // Start server
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
});
