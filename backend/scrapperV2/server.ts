import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { config } from './src/config/config';

dotenv.config();

const app = express();
const port = config.port;

// Connect to MongoDB
mongoose.connect(config.mongodb.uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.use(express.json());

// routes
import { studentRoutes } from './src/routes/studentRoutes';
import { setupSwagger } from './src/config/swagger';
import { friendRoutes } from './src/routes/friendRoutes';
app.use('/api/v2/student', studentRoutes);
app.use('/api/v2/friends', friendRoutes);

// Swagger
setupSwagger(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});