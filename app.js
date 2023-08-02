// Import required modules
const express = require('express');
const mongoose = require('mongoose');

// Create Express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todoist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Set up the public directory for static files
app.use(express.static('public'));

// Body parser middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));

// Create a Mongoose schema and model for the tasks
const taskSchema = new mongoose.Schema({
  description: String,
  isPositive: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

// Define a default brand name (you can change it later)
const brandName = 'To Do List';

// Sample data (you can change or remove these later)
const sampleTasks = [
  { description: 'Complete JavaScript tutorial', isPositive: true },
  { description: 'Exercise for 30 minutes', isPositive: true },
  { description: 'Read a book', isPositive: false },
];

// Add sample data to the database on startup
Task.insertMany(sampleTasks)
  .then(() => console.log('Sample tasks inserted successfully'))
  .catch((err) => console.error('Error inserting sample tasks:', err));

// Define routes
app.get('/', (req, res) => {
  // Fetch tasks from the database
  Task.find({})
    .exec() // Execute the query
    .then((tasks) => {
      // Render the view with the fetched tasks
      res.render('index', { brandName, tasks });
    })
    .catch((err) => {
      console.error('Error fetching tasks:', err);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/', (req, res) => {
  // Create a new task from the form data
  const newTask = new Task({
    description: req.body.task,
    isPositive: req.body.isPositive === 'true',
  });

  // Save the new task to the database
  newTask.save()
    .then(() => {
      // Redirect back to the main page after adding the task
      res.redirect('/');
    })
    .catch((err) => {
      console.error('Error saving new task:', err);
      res.status(500).send('Internal Server Error');
    });
});
// ... (previous app.js code) ...

// Handle "Done" button click
app.post('/tasks/:taskId/done', (req, res) => {
    const taskId = req.params.taskId;
  
    // Implement the logic to mark the task as done in the database
    // For demonstration purposes, let's assume the task is deleted from the database
    Task.findByIdAndDelete(taskId)
      .then(() => {
        console.log(`Task with ID ${taskId} marked as done.`);
        res.redirect('/');
      })
      .catch((err) => {
        console.error('Error marking task as done:', err);
        res.status(500).send('Internal Server Error');
      });
  });
  
  // Handle "Delete" button click
  app.post('/tasks/:taskId/delete', (req, res) => {
    const taskId = req.params.taskId;
  
    // Implement the logic to delete the task from the database
    Task.findByIdAndDelete(taskId)
      .then(() => {
        console.log(`Task with ID ${taskId} deleted.`);
        res.redirect('/');
      })
      .catch((err) => {
        console.error('Error deleting task:', err);
        res.status(500).send('Internal Server Error');
      });
  });
// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
