import express from 'express';
import { getFriendList } from '../controllers/friendsController/handleFriends/getFriendList';
import { sendFriendRequest } from '../controllers/friendsController/handleFriends/sendFriendRequest';
import { addFriend } from '../controllers/friendsController/handleFriends/addFriend';
import { getFriendRequests } from '../controllers/friendsController/handleFriends/getFriendRequests';
import { getSentFriendRequests } from '../controllers/friendsController/handleFriends/getSentFriendRequests';
import { removeFromRequest } from '../controllers/friendsController/handleFriends/removeFromRequest';
import { cancelRequest } from '../controllers/friendsController/handleFriends/cancelRequest';
import { removeFriend } from '../controllers/friendsController/handleFriends/removeFriend';

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
 *               page:
 *                 type: integer
 *                 default: 1
 *               limit:
 *                 type: integer
 *                 default: 20
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
 *                 description: Registration number of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *               page:
 *                 type: integer
 *                 default: 1
 *                 description: Page number for pagination
 *               limit:
 *                 type: integer
 *                 default: 15
 *                 description: Number of requests per page
 *               count:
 *                 type: boolean
 *                 default: false
 *                 description: If true, only returns the total number of requests
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 friendRequests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: List of friend request objects (if count is false)
 *                 totalRequests:
 *                   type: integer
 *                   description: Total number of friend requests
 *                 totalPages:
 *                   type: integer
 *                   description: Total pages available
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                 message:
 *                   type: string
 *                   description: Response message
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 errorMessage:
 *                   type: string
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
 *               page:
 *                 type: integer
 *                 default: 1
 *               limit:
 *                 type: integer
 *                 default: 15
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
friendRoutes.post('/removeFriend', removeFriend);
