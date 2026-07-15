import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const TaskApp = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  // Fetch Tasks from Backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.log(err));
  }, []);

  // Handle Image Selection
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  // Submit Task & Upload Image
  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';

    // First, upload the image using Multer endpoint
    if (imageFile) {
      const formData = new FormData();
      formData.append('taskImage', imageFile);
      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData);
      imageUrl = uploadRes.data.imageUrl;
    }

    // Second, save the task
    const taskRes = await axios.post('http://localhost:5000/api/tasks', { title, image: imageUrl });
    setTasks([...tasks, taskRes.data]);
    setTitle('');
    setImageFile(null);
    setPreview('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', fontFamily: 'Arial' }}>
      <h2>MERN Task Manager (Week 3)</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Task Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ padding: '10px' }} />
        
        {preview && <img src={preview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}
        
        <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none' }}>
          Add Task
        </button>
      </form>

      <hr />
      
      <h3>Your Tasks</h3>
      {tasks.map(task => (
        <div key={task._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h4>{task.title}</h4>
          {task.image && <img src={task.image} alt="Task" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />}
        </div>
      ))}
    </div>
  );
};

// React Router Setup
export default function App() {
  return (
    <Router>
      <nav style={{ background: '#333', padding: '10px', textAlign: 'center' }}>
        <Link to="/" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Home</Link>
        <Link to="/tasks" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Task Manager</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h2 style={{textAlign: 'center'}}>Welcome to MERN Stack Week 3</h2>} />
        <Route path="/tasks" element={<TaskApp />} />
      </Routes>
    </Router>
  );
}
