const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database', { useNewUrlParser: true, useUnifiedTopology: true });
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
const Event = mongoose.model('Event', eventSchema);

// Sample data
const sampleData = [
    {
        rollno: "25",
        eventType: "Paper",
        eventOption: "Won in Premier",
        points: null,
        imageName: [],
        institutionName: ""
    },
    // Add more sample data as needed
];

// Insert sample data into MongoDB
Event.insertMany(sampleData)
    .then(() => {
        console.log('Sample data inserted successfully');
    })
    .catch(err => {
        console.error('Error inserting sample data:', err);
    });
