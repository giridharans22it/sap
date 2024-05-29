const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection URL
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'mydb';
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

    // Add Student
    app.post('/add_student', (req, res) => {
        const { studentId, name, year, department, section, semester } = req.body;
        collection.insertOne({ studentId, name, year, department, section, semester }, (err, result) => {
            if (err) {
                console.error('Error adding student:', err);
                res.status(500).send('Error adding student');
                return;
            }
            res.send('Student added successfully');
        });
    });

    // View Student
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

    // Delete Student
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

    // Update Student
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

// Frontend JavaScript
function addStudent() {
    var studentId = document.getElementById('studentId').value;
    var name = document.getElementById('name').value;
    var year = document.getElementById('year').value;
    var department = document.getElementById('department').value;
    var section = document.getElementById('section').value;
    var semester = document.getElementById('semester').value;
    
    fetch('/add_student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            studentId: studentId,
            name: name,
            year: year,
            department: department,
            section: section,
            semester: semester
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Student added successfully');
            // Update the UI or perform other actions here
            // For example, you can display a success message to the user
            alert('Student added successfully');
            // You can also reset the form fields
            document.getElementById('studentId').value = '';
            document.getElementById('name').value = '';
            document.getElementById('year').value = '';
            document.getElementById('department').value = '';
            document.getElementById('section').value = '';
            document.getElementById('semester').value = '';
        } else {
            console.error('Error:', response.statusText);
        }
    })
    .catch(error => console.error('Error:', error));
}

function viewStudent() {
    var viewStudentId = document.getElementById('viewStudentId').value;
    fetch(`/view_student?id=${viewStudentId}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                console.log('Student details:', data);
                // Update the UI with student details here
                // For example, you can display the student details in a modal or table
                // You can also populate form fields with the student data for editing
                // For now, let's just log the data to the console
                console.log(data);
            } else {
                console.log('Student not found');
                // Update the UI or perform other actions here
                // For example, you can display a message indicating that the student was not found
            }
        })
        .catch(error => console.error('Error:', error));
}

function deleteStudent() {
    var deleteStudentId = document.getElementById('deleteStudentId').value;
    fetch('/delete_student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: deleteStudentId })
    })
    .then(response => {
        if (response.ok) {
            console.log('Student deleted successfully');
            // Update the UI or perform other actions here
            // For example, you can remove the deleted student from the list
        } else {
            console.error('Error:', response.statusText);
        }
    })
    .catch(error => console.error('Error:', error));
}

function updateStudent() {
    var studentId = document.getElementById('updateStudentId').value;
    var name = document.getElementById('updateName').value;
    var year = document.getElementById('updateYear').value;
    var department = document.getElementById('updateDepartment').value;
    var section = document.getElementById('updateSection').value;
    var semester = document.getElementById('updateSemester').value;

    fetch('/update_student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: studentId,
            name: name,
            year: year,
            department: department,
            section: section,
            semester: semester
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Student updated successfully');
            // Update the UI or perform other actions here
            // For example, you can display a success message to the user
            alert('Student updated successfully');
        } else {
            console.error('Error:', response.statusText);
        }
    })
    .catch(error => console.error('Error:', error));
}

function showForm(formId) {
    // Get all form elements
    var forms = document.querySelectorAll('div[id$="Form"]');
    
    // Hide all forms
    forms.forEach(form => {
        form.style.display = 'none';
    });
    
    // Show the selected form
    var selectedForm = document.getElementById(formId);
    if (selectedForm) {
        selectedForm.style.display = 'block';
    } else {
        console.error('Form with id ' + formId + ' not found.');
    }
}
