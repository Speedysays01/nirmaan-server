// Import required modules
import express from 'express'
import dotenv from 'dotenv'
import { connectDb } from './database/db.js';
import cors from "cors";

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());


// Root route
app.get('/', (req, res) => {
  res.send('API is running correctly...');
});

// Get the port from environment variables or use 5000 as default
const PORT = process.env.PORT || 5000;

//importing routers
import projectRoutes from './routes/ProjectRoutes.js'

//using routes
app.use("/api/project", projectRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDb();
});
