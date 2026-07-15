const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // इमेज दिखाने के लिए

// MongoDB Connection
mongoose.connect('mongodb+srv://testuser:testpass@cluster0.mongodb.net/taskdb?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Multer Configuration for Image Upload (Task 2)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Task Schema
const TaskSchema = new mongoose.Schema({
    title: String,
    image: String,
    completed: { type: Boolean, default: false }
});
const Task = mongoose.model('Task', TaskSchema);

// --- APIs ---

// 1. Upload Image Endpoint (Multer)
app.post('/api/upload', upload.single('taskImage'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});

// 2. Create Task
app.post('/api/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

// 3. Get All Tasks
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.listen(5000, () => console.log('Backend running on port 5000'));
