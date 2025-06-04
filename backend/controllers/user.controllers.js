import  User  from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are mandatory",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Incorrect email or Password",
        success: false,
      });
    }

    //check role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with this role",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        samesite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logout Successful",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false
  })
};
}

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills, role} = req.body;
    const file = req.file;

    // if (!fullname || !email || !phoneNumber || !role) {
    //   return res.status(400).json({
    //     message: "All fields are required",
    //     success: false,
    //   });
    // }



    // cloudinary ayega

    const skillsArray = skills ? skills.split(",").map(skill => skill.trim()).filter(skill => skill) : [];    
    const userId = req.id; // middleware authentication
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    // updating data
    if(fullname) (user.fullname = fullname)
    if(email)  (user.email = email)
    if(phoneNumber)  (user.phoneNumber = phoneNumber)
    if(bio)  (user.profile.bio = bio)
    if(skills)  (user.profile.skills = skillsArray);

    // resume comes later here...

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    })
  }
}

// export const updateProfile = async (req, res) => {
//     try {
//       const { fullname, email, phoneNumber, bio, skills, role } = req.body;
//       const file = req.file;
  
//       // Validation for required fields
//       if (!fullname || !email || !phoneNumber || !role) {
//         return res.status(400).json({
//           message: "All fields are required",
//           success: false,
//         });
//       }
  
//       // Process skills - handle empty skills gracefully
//       const skillsArray = skills ? skills.split(",").map(skill => skill.trim()).filter(skill => skill) : [];
      
//       // Get user ID from auth middleware
//       const userId = req.id; // Set by isAuthenticated middleware
      
//       if (!userId) {
//         return res.status(401).json({
//           message: "Authentication required",
//           success: false,
//         });
//       }
  
//       let user = await User.findById(userId);
  
//       if (!user) {
//         return res.status(404).json({
//           message: "User not found",
//           success: false,
//         });
//       }
  
//       // Update user data
//       user.fullname = fullname;
//       user.email = email;
//       user.phoneNumber = phoneNumber;
//       user.role = role; // This was missing!
//       user.profile.bio = bio;
//       user.profile.skills = skillsArray;
  
//       // Handle file upload if present
//       if (file) {
//         // TODO: Implement Cloudinary upload
//         // const cloudinaryResponse = await uploadToCloudinary(file);
//         // user.profile.profilePhoto = cloudinaryResponse.secure_url;
//       }
  
//       await user.save();
  
//       // Return updated user data (excluding sensitive info)
//       const updatedUser = {
//         _id: user._id,
//         fullname: user.fullname,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//         role: user.role,
//         profile: user.profile,
//       };
  
//       return res.status(200).json({
//         message: "Profile updated successfully",
//         user: updatedUser,
//         success: true,
//       });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({
//         message: "Internal server error",
//         success: false,
//       });
//     }
//   };