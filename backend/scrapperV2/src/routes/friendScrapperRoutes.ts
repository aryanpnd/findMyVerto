import express from 'express';
import { getFriendTimetable } from '../controllers/friendsScrapper/getFriendTimetable';

export const friendScrapperRoutes = express.Router();

/**
 * @swagger
 * /api/v2/friends/timetable:
 *   post:
 *     tags: [Friends Scrapper]
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
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */
friendScrapperRoutes.post('/timetable', getFriendTimetable);
