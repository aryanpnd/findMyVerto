import express, { Request, Response } from 'express';
import { getStudentBasicInfo } from '../controllers/studentController/studentController';
import { getStudentLogin } from '../controllers/studentController/studentAuthController';
import { getStudentTimeTable } from '../controllers/studentController/studentTimetableController';
import { getStudentAttendance } from '../controllers/studentController/studentAttendanceController';
import { searchStudent } from '../controllers/studentController/studentSearchController';
import { getStudentMarks } from '../controllers/studentController/getStudentMarksController';
import { getStudentCgpa } from '../controllers/studentController/getStudentCgpaController';
import { getStudentExams } from '../controllers/studentController/getStudentExamsController';
import { getStudentPendingAssignments } from '../controllers/studentController/studentPendingAssignmentsController';
import { getStudentAssignments } from '../controllers/studentController/studentAssignmentsController';
import { getStudentMakeup } from '../controllers/studentController/studentMakeupController';
import { getStudentMessages } from '../controllers/studentController/studentMessagesController';
import { getStudentMyDrives } from '../controllers/studentController/studentMyDrivesController';
import { getStudentLeaveSlip } from '../controllers/studentController/studentResidentialController';
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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         required: false
 *         description: Number of students to return per page (optional)
 *     responses:
 *       200:
 *         description: Successful response
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
 *               devicePushToken:
 *                 type: string
 *                 required: false
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
studentRoutes.post('/timetable', (req: Request, res: Response) => {
  getStudentTimeTable(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unexpected server error",
      errorMessage: err.message,
    });
  });
});


/**
 * @swagger
 * /api/v2/student/makeup:
 *   post:
 *     tags: [Student]
 *     summary: Get student makeup classes
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
studentRoutes.post('/makeup', (req: Request, res: Response) => {
  getStudentMakeup(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({
      success: false,
      data: {},
      message: "Unexpected server error",
      errorMessage: err.message,
    });
  })
})

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
studentRoutes.post('/attendance', (req: Request, res: Response) => {
  getStudentAttendance(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({
      success: false,
      summary: {},
      details: {},
      message: "Unexpected server error",
      errorMessage: err.message,
    });
  });
});

/**
 * @swagger
 * /api/v2/student/marks:
 *   post:
 *     tags: [Student]
 *     summary: Get student marks
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
studentRoutes.post('/marks', (req: Request, res: Response) => {
  getStudentMarks(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({
      success: false,
      data: {},
      message: "Unexpected server error",
      errorMessage: err.message,
    });
  });
});

/**
 * @swagger
 * /api/v2/student/cgpa:
 *   post:
 *     tags: [Student]
 *     summary: Get student cgpa
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
studentRoutes.post('/cgpa', (req: Request, res: Response) => {
  getStudentCgpa(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({
      success: false,
      data: {},
      message: "Unexpected server error",
      errorMessage: err.message,
    });
  })
})

/**
 * @swagger
 * /api/v2/student/exams:
 *   post:
 *     tags: [Student]
 *     summary: Get student exams
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
studentRoutes.post('/exams', (req: Request, res: Response) => {
  getStudentExams(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({
      success: false,
      data: {},
      message: "Unexpected server error",
      errorMessage: err.message,
    });
  })
})

/**
 * @swagger
 * /api/v2/student/pendingAssignments:
 *   post:
 *     tags: [Student]
 *     summary: Get student pending assignments
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
studentRoutes.post('/pendingAssignments', (req: Request, res: Response) => {
  getStudentPendingAssignments(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({
      success: false,
      data: {},
      message: "Unexpected server error",
      errorMessage: err.message,
    });
  })
})

/**
 * @swagger
 * /api/v2/student/assignments:
 *   post:
 *     tags: [Student]
 *     summary: Get student assignments
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
studentRoutes.post('/assignments', (req: Request, res: Response) => {
  getStudentAssignments(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({
      success: false,
      data: {},
      message: "Unexpected server error",
      errorMessage: err.message,
    });
  })
})

/**
 * @swagger
 * /api/v2/student/messages:
 *   post:
 *     tags: [Student]
 *     summary: Get student messages
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
 *               pageIndex:
 *                 type: number
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
studentRoutes.post('/messages', (req: Request, res: Response) => {
  getStudentMessages(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({
      success: false,
      data: {},
      message: "Unexpected server error",
      errorMessage: err.message,
    });
  })
})

/**
 * @swagger
 * /api/v2/student/myDrives:
 *   post:
 *     tags: [Student]
 *     summary: Get student placement drives
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
studentRoutes.post('/myDrives', (req: Request, res: Response) => {
  getStudentMyDrives(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({
      success: false,
      data: {},
      message: "Unexpected server error",
      errorMessage: err.message,
    });
  })
})

/**
 * @swagger
 * /api/v2/student/leaveSlip:
 *   post:
 *     tags: [Student]
 *     summary: Get student leave slip
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
studentRoutes.post('/leaveSlip', (req: Request, res: Response) => {
  getStudentLeaveSlip(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({
      success: false,
      data: {},
      message: "Unexpected server error",
      errorMessage: err.message,
    });
  }
  )
})