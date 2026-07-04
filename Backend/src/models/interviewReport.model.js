const mongoose = require ('mongoose');

/**
 * JOB DESCRIPTION : STRING
 * RESUME TEXT : STRING
 * SELF DECLARATION : STRING
 * MATCH SCORE : NUMBER
 * 
 * **AI GENERATED
 * TECHNICAL QUESTION : 
 *              [{
 *              QUESTION : ""
 *              INTENTION : ""
 *              ANSWER : ""
 *              }]
 * BEHAVIORAL QUESTION :
 *              [{
 *              QUESTION : ""
 *              INTENTION : ""
 *              ANSWER : ""
 *              }]
 * SKILL GAPS : [
 *              {
 *              SKILL : "",
 *              SEVERITY : {
 *              TYPE : STRING
 *              ENUM : ["LOW","MEDIUM","HIGH"]
 *              }
 *              
 *              }
 *              ]
 * PREPARATION PLAN : [{
 *          DAY : NUMBER
 *          FOCUS : STRING
 *          TASKS : [STRING]
 *          }]
 * 
 */
const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"Intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    }
},
{
_id:false})

const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"behavioral question is required"]
    },
    intention:{
        type:String,
        required:[true,"Intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    }
},{
_id:false})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:[true,"Skill is required"]
    },
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:[true,"severity is required"]
    }
}, {
_id:false})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required: [true,"day is required"]
    },
    focus:{
        type:String,
        required:[true,"focus is required"]
    },
    tasks:[{
      type:String,
      required:[true,"task is required"]  
    }]
}, {
_id:false}) 

const interviewReportSchema=new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,"JOB DESCRIPTION IS REQUIRED"]
    },
    resume:{
        type:String
    },
    selfDescription:{
        type:String
    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },
    technicalQuestion:[technicalQuestionSchema],
    behavioralQuestion:[behavioralQuestionSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationPlanSchema],
user:{
type:mongoose.Schema.Types.ObjectId,
ref:"users"
}},
{
    timestamps:true
})

const interviewReportModel = mongoose.model("InterviewReport",interviewReportSchema)
module.exports = interviewReportModel; 
