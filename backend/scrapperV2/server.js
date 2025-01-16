"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
// Import routes
const studentRoutes_1 = require("./src/routes/studentRoutes");
const swagger_1 = require("./src/config/swagger");
app.use('/api/v2/student', studentRoutes_1.studentRoutes);
// Setup Swagger
(0, swagger_1.setupSwagger)(app);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
