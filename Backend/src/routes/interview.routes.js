const express = require("express")
const authMiddleware=require("../middleware/auth.middleware")
const interviewController=require("../controllers/interview.controller")
const upload = require("../middleware/file.middleware")


const interviewRouter = express.Router();
/**
 * @Route POST /api/interview
 * @description It is used to generate interview report using self description,resume pdf and job description
 * @access private
 */
interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)

/**
 * @Route GET /api/interview
 * @description It is used to fetch previous reports for the logged in user
 * @access private
 */
interviewRouter.get("/",authMiddleware.authUser,interviewController.getUserInterviewReportsController)

/**
 * @Route GET /api/interview/:id
 * @description It is used to fetch one interview report for the logged in user
 * @access private
 */
interviewRouter.get("/:id",authMiddleware.authUser,interviewController.getInterviewReportByIdController)

module.exports = interviewRouter;
