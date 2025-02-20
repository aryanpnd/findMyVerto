import express from 'express';
import { getFriendTimetable } from '../controllers/friendsController/handleFriendData/getFriendTimetable';
import { getFriendData } from '../controllers/friendsController/handleFriendData/getFriendData';
import { getFriendAttendance } from '../controllers/friendsController/handleFriendData/getFriendAttendance';
import { getFriendCgpa } from '../controllers/friendsController/handleFriendData/getFriendMarks';
import { getFriendMarks } from '../controllers/friendsController/handleFriendData/getFriendCgpa';
import { getFriendExams } from '../controllers/friendsController/handleFriendData/getFriendExams';
import { getFriendAssignments } from '../controllers/friendsController/handleFriendData/getFriendAssignments';

export const friendScrapperRoutes = express.Router();

/**
 * @swagger
 * /api/v2/friends/getFriendInfo:
 *   post:
 *     tags: [Friend's Data]
 *     summary: Get friend information
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
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
friendScrapperRoutes.post('/getFriendInfo', getFriendData);

/**
 * @swagger
 * /api/v2/friends/timetable:
 *   post:
 *     tags: [Friend's Data]
 *     summary: Get friend's timetable
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
 *               studentId:
 *                 type: string
 *               sync:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
friendScrapperRoutes.post('/timetable', getFriendTimetable);

/**
 * @swagger
 * /api/v2/friends/attendance:
 *   post:
 *     tags: [Friend's Data]
 *     summary: Get friend's attendance
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
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
friendScrapperRoutes.post('/attendance', getFriendAttendance);

/**
 * @swagger
 * /api/v2/friends/marks:
 *   post:
 *     tags: [Friend's Data]
 *     summary: Get friend's marks
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
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
friendScrapperRoutes.post('/marks', getFriendMarks);

/**
 * @swagger
 * /api/v2/friends/cgpa:
 *   post:
 *     tags: [Friend's Data]
 *     summary: Get friend's cgpa
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
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
friendScrapperRoutes.post('/cgpa', getFriendCgpa);

/**
 * @swagger
 * /api/v2/friends/exams:
 *   post:
 *     tags: [Friend's Data]
 *     summary: Get friend's exams
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
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
friendScrapperRoutes.post('/exams', getFriendExams);

/**
 * @swagger
 * /api/v2/friends/assignments:
 *   post:
 *     tags: [Friend's Data]
 *     summary: Get friend's assignments
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
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
friendScrapperRoutes.post('/assignments', getFriendAssignments)