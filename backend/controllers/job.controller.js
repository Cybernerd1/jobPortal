import Job  from "../models/job.models.js"
// Admin to host jobs

import { Company } from "../models/company.model.js";
export const postJob = async (req,res)=>{
    try {
        const {title, description,requirements, salary, location, jobType, experienceLevel, position, companyId} = req.body; 

        if(!title|| !description|| !requirements || !salary || !location || !jobType || !experienceLevel || !position || !companyId){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            })
        }

        const userId = req.id;

        const job = await Job.create({
            title,
            description,
            requirements,
            salary:Number(salary),
            location,
            experienceLevel,
            position,
            company:companyId,
            created_by:userId

        });

        return res.status(201).json({
            message:"new Job created successfully",
            job,
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}
// student
export const getAllJobs = async(req,res)=>{
    try {
        const keyword = req.query.keyword || "";
        const query= {
            $or:[
                {title:{$regex:keyword, $options:"i"}},
                {description:{$regex:keyword, $options:"i"}},
            ]

        }
        const jobs = await Job.find(query).populate({
            path:"company"
        }).sort({createdAt:-1})
        if (!jobs){
            return res.status(404).json({
                message:"jobs not found",
                success:false
            })
        }
        return res.status(200).json({
            jobs,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}
// student
export const getJobById = async (req,res) =>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate("company");
        if(!job){
            return res.status(404).json({
                message:"Jobs not found",
                success:false
            })
        }
        return res.status(200).json({job,success:true})
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
          });
    }
}

// admin kitne job create kra h abhi tk
export const getAdminJobs = async (req,res) =>{
    try {
        const adminId = req.id;
        const jobs = await Job.find({created_by:adminId})
        if(!jobs){
            return res.status(404).json({
                message:"Jobs not found",
                success:false
            })
        }
        return res.status(200).json({
            jobs,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}