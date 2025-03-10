import express from 'express';
import { getStudentAllowedFields, setStudentAllowedFields } from '../controllers/studentController/studentAllowedFieldsController';
import { get } from 'http';
import { saveDevicePushToken } from '../controllers/studentController/studentController';

export const StudentSettingsRoutes = express.Router();

/**
 * @swagger
 * /api/v2/student/settings/allowedFieldsToShow:
 *   post:
 *     tags: [Student Settings]
 *     summary: Get allowed fields to show
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
 *       404:
 *         description: Student not found
 */
StudentSettingsRoutes.post('/settings/allowedFieldsToShow', getStudentAllowedFields);

/**
 * @swagger
 * /api/v2/student/settings/allowedFieldsToShow/set:
 *   post:
 *     tags: [Student Settings]
 *     summary: Set allowed fields to show
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
 *               fields:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Student not found
 */
StudentSettingsRoutes.post('/settings/allowedFieldsToShow/set', setStudentAllowedFields);

/**
 * @swagger
 * /api/v2/student/settings/setDevicePushToken:
 *   post:
 *     tags: [Student Settings]
 *     summary: Set device push token
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
 *               devicePushToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Student not found
 */
StudentSettingsRoutes.post('/settings/setDevicePushToken', saveDevicePushToken);