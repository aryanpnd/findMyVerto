import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { config } from './src/config/config';
import path from 'path';

dotenv.config();

const app = express();
const port = config.port;

app.use('/public', express.static(path.join(__dirname, './public')));

app.get('/status', (req, res) => {
  res.status(200).json({ status: 'Server is up and running' });
});

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
import { friendScrapperRoutes } from './src/routes/friendScrapperRoutes';
import { StudentSettingsRoutes } from './src/routes/studentsSettings';
app.use('/api/v2/student', studentRoutes,StudentSettingsRoutes);
app.use('/api/v2/friends', friendRoutes,friendScrapperRoutes);

// Swagger
setupSwagger(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});