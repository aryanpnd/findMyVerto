import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Import routes
import {studentRoutes} from './src/routes/studentRoutes';
import { setupSwagger } from './src/config/swagger';
app.use('/api/v2/student', studentRoutes);

// Setup Swagger
setupSwagger(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});