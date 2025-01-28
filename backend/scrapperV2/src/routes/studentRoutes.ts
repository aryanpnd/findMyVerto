import express from 'express';
import { getStudentBasicInfo  } from '../controllers/studentController/studentController';
import { getStudentLogin } from '../controllers/studentController/studentAuthController';
import { getStudentTimeTable } from '../controllers/studentController/studentTimetableController';
import { getStudentAttendance } from '../controllers/studentController/studentAttendanceController';
import { searchStudent } from '../controllers/studentController/studentSearchController';
export const studentRoutes = express.Router();

/**
 * @swagger
 * /api/v2/student/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login to UMS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reg_no:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
studentRoutes.post('/login', getStudentLogin);
/**
 * @swagger
 * /api/v2/student/search:
 *   get:
 *     tags: [Student]
 *     summary: Search for students based on query
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query (name, registration number, or section)
 *       - in: query
 *         name: r
 *         schema:
 *           type: string
 *         required: false
 *         description: Registration number for authentication (optional)
 *       - in: query
 *         name: p
 *         schema:
 *           type: string
 *         required: false
 *         description: Password for authentication (optional)
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid search query
 *       404:
 *         description: No student found
 *       500:
 *         description: Internal server error
 */
studentRoutes.get('/search', searchStudent);

/**
 * @swagger
 * /api/v2/student/basicInfo:
 *   post:
 *     tags: [Student]
 *     summary: Get student basic information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reg_no:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
studentRoutes.post('/basicInfo', getStudentBasicInfo);
/**
 * @swagger
 * /api/v2/student/timetable:
 *   post:
 *     tags: [Student]
 *     summary: Get student timetable
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reg_no:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
studentRoutes.post('/timetable', getStudentTimeTable);
/**
 * @swagger
 * /api/v2/student/attendance:
 *   post:
 *     tags: [Student]
 *     summary: Get student attendance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reg_no:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
studentRoutes.post('/attendance', getStudentAttendance);