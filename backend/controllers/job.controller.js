import Job from "../models/job.models.js";
// Admin to host jobs

import { Company } from "../models/company.model.js";
// export const postJob = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       requirements,
//       salary,
//       location,
//       jobType,
//       experienceLevel,
//       position,
//       companyId,
//     } = req.body;

//     console.log("Extracted fields:");
//     console.log("title:", title);
//     console.log("jobType:", jobType);
//     console.log("experienceLevel:", experienceLevel);
//     console.log("companyId:", companyId);

//     if (
//       !title ||
//       !description ||
//       !requirements ||
//       !salary ||
//       !location ||
//       !jobType ||
//       !experienceLevel ||
//       !position ||
//       !companyId
//     ) {
//       // Show which specific field is missing
//       const missingFields = [];
//       if (!title) missingFields.push("title");
//       if (!description) missingFields.push("description");
//       if (!requirements) missingFields.push("requirements");
//       if (!salary) missingFields.push("salary");
//       if (!location) missingFields.push("location");
//       if (!jobType) missingFields.push("jobType");
//       if (!experienceLevel) missingFields.push("experienceLevel");
//       if (!position) missingFields.push("position");
//       if (!companyId) missingFields.push("companyId");

//       return res.status(400).json({
//         message: `Missing required fields: ${missingFields.join(", ")}`,
//         success: false,
//       });
//     }
//     const userId = req.id;
//     if (!userId) {
//       return res.status(401).json({
//         message: "Authentication required",
//         success: false,
//       });
//     }

//     const requirementsArray = Array.isArray(requirements)
//       ? requirements
//       : requirements.split(",").map((req) => req.trim());

//     const job = await Job.create({
//       title,
//       description,
//       requirements,
//       salary: Number(salary),
//       location,
//       experienceLevel,
//       position,
//       company: companyId,
//       created_by: userId,
//     });

//     return res.status(201).json({
//       message: "new Job created successfully",
//       job,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// student

export const postJob = async (req, res) => {
  try {
    // Add debugging to see what's actually received
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel,
      position,
      companyId,
    } = req.body;

    // Debug individual fields
    console.log("Extracted fields:");
    console.log("title:", title);
    console.log("jobType:", jobType);
    console.log("experienceLevel:", experienceLevel);
    console.log("companyId:", companyId);

    // Validation for required fields
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experienceLevel ||
      !position ||
      !companyId
    ) {
      // Show which specific field is missing
      const missingFields = [];
      if (!title) missingFields.push("title");
      if (!description) missingFields.push("description");
      if (!requirements) missingFields.push("requirements");
      if (!salary) missingFields.push("salary");
      if (!location) missingFields.push("location");
      if (!jobType) missingFields.push("jobType");
      if (!experienceLevel) missingFields.push("experienceLevel");
      if (!position) missingFields.push("position");
      if (!companyId) missingFields.push("companyId");

      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
        success: false,
      });
    }

    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    // Convert requirements to array if it's a string
    const requirementsArray = Array.isArray(requirements)
      ? requirements
      : requirements.split(",").map((req) => req.trim());

    // Create job object for debugging
    // Try different field name mappings based on your schema
    const jobData = {
      title,
      description,
      requirements: requirementsArray,
      salary: Number(salary),
      location,
      // Try one of these based on your actual schema:
      jobType, // if schema uses jobType
      // job_type: jobType, // if schema uses job_type
      // type: jobType,     // if schema uses type
      experienceLevel: Number(experienceLevel),
      // experience: Number(experienceLevel), // if schema uses experience
      position: Number(position),
      company: companyId,
      created_by: userId,
    };

    console.log("Job data to be saved:", JSON.stringify(jobData, null, 2));

    const job = await Job.create(jobData);

    return res.status(201).json({
      message: "New job created successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.error("Error creating job:", error);

    // Handle mongoose validation errors specifically
    if (error.name === "ValidationError") {
      const validationErrors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }));

      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "jobs not found",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate("company");
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found",
        success: false,
      });
    }
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

// admin kitne job create kra h abhi tk
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
