const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 1000;
const MONGODB_URI = 'mongodb://localhost:27017/';
const DB_NAME = 'SAP';

// Connect to MongoDB
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
connectToMongoDB();

// Routes
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = client.db(DB_NAME);
        const collection = db.collection('user_credentials');
        const user = await collection.findOne({ username, password });

        if (username.endsWith('@kongu.edu') && password === 's') {
            res.redirect('/student');
        } else if (username.endsWith('@kongu.ac.in') && password === 'a') {
            res.redirect('/advisor');
        } else {
            res.send('Invalid username or password.');
        }
    } catch (error) {
        console.error('Error while logging in:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/student', (req, res) => {
    res.sendFile(__dirname + '/student/student.html');
});

app.get('/advisor', (req, res) => {
    res.sendFile(__dirname + '/advisor/advisor.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});