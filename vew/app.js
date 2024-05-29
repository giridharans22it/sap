const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/SAP', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a schema for your collection
const eventSchema = new mongoose.Schema({
    rollno: String,
    eventType: String,
    eventOption: String,
    points: Number,
    imageName: [String],
    institutionName: String
});

// Create a model based on the schema
const Event = mongoose.model('Event', eventSchema, 'Data');

// Function to insert sample data into the collection
async function insertSampleData() {
    try {
        await Event.insertMany([
            {
                rollno: "25",
                eventType: 'Paper',
                eventOption: 'Only Submitted',
                points: null,
                imageName: [],
                institutionName: null
            }
        ]);
        console.log('Sample data inserted successfully');
    } catch (error) {
        console.error('Error inserting sample data:', error);
    }
}

// Route to fetch data from MongoDB and render the HTML page
app.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        let html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Event Table</title>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                    tr:hover {
                        background-color: #ddd;
                    }
                    .action-buttons {
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <table>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Roll No</th>
                            <th>Event Type</th>
                            <th>Event Option</th>
                            <th>Points</th>
                            <th>Image Name</th>
                            <th>Institution Name</th>
                        </tr>
                    </thead>
                    <tbody>`;

        events.forEach((event, index) => {
            html += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${event.rollno}</td>
                            <td>${event.eventType}</td>
                            <td>${event.eventOption}</td>
                            <td>${event.points}</td>
                            <td>${event.imageName.join(', ')}</td>
                            <td>${event.institutionName}</td>
                        </tr>`;
        });

        html += `
                    </tbody>
                </table>
            </body>
            </html>`;

        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Insert sample data when the server starts
insertSampleData();

// Start the server
app.listen(2000, () => {
    console.log('Server is running on port 3000');
});
