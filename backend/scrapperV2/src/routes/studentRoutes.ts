import express from 'express';
import { getStudentBasicInfo  } from '../controllers/studentController';
import { getStudentLogin } from '../controllers/studentAuthController';
import { getStudentTimeTable } from '../controllers/studentTimetableController';
import { getStudentAttendance } from '../controllers/studentAttendanceController';
export const studentRoutes = express.Router();

/**
 * @swagger
 * /api/v2/student/login:
 *   post:
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
 *                 example: string
 *               password:
 *                 type: string
 *                 example: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
studentRoutes.post('/login', getStudentLogin); 

/**
 * @swagger
 * /api/v2/student/basicInfo:
 *   post:
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
 * /api/v2/student/timetable:
 *   post:
 *     summary: Get student timetabl
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
