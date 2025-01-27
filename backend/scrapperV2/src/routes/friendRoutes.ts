import express from 'express';
import { getFriendList } from '../controllers/friendsController/getFriendList';
import { sendFriendRequest } from '../controllers/friendsController/sendFriendRequest';
import { getFriendData } from '../controllers/friendsController/getFriendData';
import { addFriend } from '../controllers/friendsController/addFriend';
import { getFriendRequests } from '../controllers/friendsController/getFriendRequests';
import { getSentFriendRequests } from '../controllers/friendsController/getSentFriendRequests';
import { removeFromRequest } from '../controllers/friendsController/removeFromRequest';
import { cancelRequest } from '../controllers/friendsController/cancelRequest';

export const friendRoutes = express.Router();

/**
 * @swagger
 * /api/v2/friends/getFriends:
 *   post:
 *     tags: [Friends]
 *     summary: Get friends list
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
friendRoutes.post('/getFriends', getFriendList);

/**
 * @swagger
 * /api/v2/friends/sendRequest:
 *   post:
 *     tags: [Friends]
 *     summary: Send friend request
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
friendRoutes.post('/sendRequest', sendFriendRequest);

/**
 * @swagger
 * /api/v2/friends/addFriend:
 *   post:
 *     tags: [Friends]
 *     summary: Add friend to friend list
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
friendRoutes.post('/addFriend', addFriend);

/**
 * @swagger
 * /api/v2/friends/getRequests:
 *   post:
 *     tags: [Friends]
 *     summary: Get friend requests
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
friendRoutes.post('/getRequests', getFriendRequests);

/**
 * @swagger
 * /api/v2/friends/getSentRequests:
 *   post:
 *     tags: [Friends]
 *     summary: Get sent friend requests
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
friendRoutes.post('/getSentRequests', getSentFriendRequests);

/**
 * @swagger
 * /api/v2/friends/removeRequest:
 *   post:
 *     tags: [Friends]
 *     summary: Remove friend request
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
friendRoutes.post('/removeRequest', removeFromRequest);

/**
 * @swagger
 * /api/v2/friends/cancelRequest:
 *   post:
 *     tags: [Friends]
 *     summary: Cancel sent friend request
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
friendRoutes.post('/cancelRequest', cancelRequest);

/**
 * @swagger
 * /api/v2/friends/getFriendInfo:
 *   post:
 *     tags: [Friends]
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
friendRoutes.post('/getFriendInfo', getFriendData);

/**
 * @swagger
 * /api/v2/friends/removeFriend:
 *   post:
 *     tags: [Friends]
 *     summary: Remove friend from friend list
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
friendRoutes.post('/removeFriend', getFriendList);
