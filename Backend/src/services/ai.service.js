const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
    matchScore: z
        .number()
        .min(0)
        .max(100)
        .describe("The percentage match between the candidate's resume and the job description."),

    technicalQuestion: z.array(
        z.object({
            question: z
                .string()
                .describe("The technical interview question."),
            intention: z
                .string()
                .describe("Why the interviewer asks this question."),
            answer: z
                .string()
                .describe("The ideal answer or approach to answer this question.")
        })
    ).describe("Technical interview questions with intention and answer."),

    behavioralQuestion: z.array(
        z.object({
            question: z
                .string()
                .describe("The behavioral interview question."),
            intention: z
                .string()
                .describe("Why the interviewer asks this question."),
            answer: z
                .string()
                .describe("The ideal answer or approach to answer this question.")
        })
    ).describe("Behavioral interview questions with intention and answer."),

    skillGaps: z.array(
        z.object({
            skill: z
                .string()
                .describe("The missing or weak skill."),
            severity: z
                .enum(["low", "medium", "high"])
                .describe("Severity of the skill gap.")
        })
    ).describe("List of missing skills."),

    preparationPlan: z.array(
        z.object({
            day: z
                .number()
                .describe("Preparation day number."),
            focus: z
                .string()
                .describe("Focus area for the day."),
            tasks: z
                .array(z.string())
                .describe("Tasks to complete on this day.")
        })
    ).describe("7-day preparation plan.")
});

const questionSchema = {
    type: "object",
    properties: {
        question: { type: "string" },
        intention: { type: "string" },
        answer: { type: "string" }
    },
    required: ["question", "intention", "answer"]
}

const interviewReportResponseSchema = {
    type: "object",
    properties: {
        matchScore: {
            type: "number",
            minimum: 0,
            maximum: 100
        },
        technicalQuestion: {
            type: "array",
            items: questionSchema
        },
        behavioralQuestion: {
            type: "array",
            items: questionSchema
        },
        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string" },
                    severity: {
                        type: "string",
                        enum: ["low", "medium", "high"]
                    }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: { type: "number" },
                    focus: { type: "string" },
                    tasks: {
                        type: "array",
                        items: { type: "string" }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: [
        "matchScore",
        "technicalQuestion",
        "behavioralQuestion",
        "skillGaps",
        "preparationPlan"
    ]
}

async function invokeGemini({
    resume,
    selfDescription,
    jobDescription,
}) {
    try {
        const prompt = `
You are an expert HR Recruiter and Technical Interview Coach.

Analyze the candidate using the Resume, Self Description and Job Description.

==========================
JOB DESCRIPTION
==========================
${jobDescription}

==========================
RESUME
==========================
${resume}

==========================
SELF DESCRIPTION
==========================
${selfDescription}

Generate a complete interview report.

The report must include:

1. matchScore
- Number between 0 and 100.

2. technicalQuestion
Generate 8 technical interview questions.
Each question must contain:
- question
- intention
- answer

3. behavioralQuestion
Generate 5 behavioral interview questions.
Each question must contain:
- question
- intention
- answer

4. skillGaps
Generate 5 missing skills.
Each skill must contain:
- skill
- severity (low, medium or high)

5. preparationPlan
Generate a 7-day preparation plan.

Each day must contain:
- day
- focus
- tasks (array of strings)

Return ONLY valid JSON.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: interviewReportResponseSchema,
            },
        });

        const report = JSON.parse(response.text);
        return interviewReportSchema.parse(report);
    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
}

module.exports = invokeGemini;
