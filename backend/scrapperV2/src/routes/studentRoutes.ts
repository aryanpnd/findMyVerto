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
 *     summary: Search student
 *     parameters:
 *       - in: query
 *         name: reg_no
 *         schema:
 *           type: string
 *         required: true
 *         description: Student registration number
 *     responses:
 *       200:
 *         description: Successful response
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