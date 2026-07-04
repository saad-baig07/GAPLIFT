const pdfParse = require("pdf-parse")
const invokeGemini = require("../services/ai.service")
const interviewReportModel=require("../models/interviewReport.model")

async function generateInterviewReportController(req,res){
    try {
        if(!req.file){
            return res.status(400).json({
                message:"Resume pdf is required"
            })
        }

        const {selfDescription,jobDescription} = req.body

        if(!selfDescription || !jobDescription){
            return res.status(400).json({
                message:"Self description and job description are required"
            })
        }

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

        const reportByAi=await invokeGemini({
            resume:resumeContent.text,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user:req.user.id,
            resume:resumeContent.text,
            selfDescription,
            jobDescription,
            ...reportByAi
        })

        res.status(201).json({
            message:"Interview report generated successfully",
            interviewReport
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message:"Failed to generate interview report"
        })
    }
}

async function getUserInterviewReportsController(req,res){
    try {
        const interviewReports = await interviewReportModel
            .find({user:req.user.id})
            .select("jobDescription matchScore skillGaps createdAt")
            .sort({createdAt:-1})

        res.status(200).json({
            message:"Interview reports fetched successfully",
            interviewReports
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message:"Failed to fetch interview reports"
        })
    }
}

async function getInterviewReportByIdController(req,res){
    try {
        const interviewReport = await interviewReportModel.findOne({
            _id:req.params.id,
            user:req.user.id
        })

        if(!interviewReport){
            return res.status(404).json({
                message:"Interview report not found"
            })
        }

        res.status(200).json({
            message:"Interview report fetched successfully",
            interviewReport
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message:"Failed to fetch interview report"
        })
    }
}

module.exports={
    generateInterviewReportController,
    getUserInterviewReportsController,
    getInterviewReportByIdController
};
