import TryCatch from "../midlewares/TryCatch.js";
import Data from "../models/dataModel.js";
import nodemailer from "nodemailer";

// Updated generateUniqueProjectID function
async function generateUniqueProjectID() {
  let isUnique = false;
  let projectID;

  while (!isUnique) {
    projectID = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number

    // Check if the projectID already exists
    const existingProject = await Data.findOne({ projectID });

    if (!existingProject) {
      isUnique = true; // If unique, exit the loop
    }
  }

  return projectID;
}

export const createProject = TryCatch(async (req, res) => {
  const {
    projectName,
    category,
    description,
    leaderName,
    leaderDepartment,
    leaderRollNo,
    leaderPhoneNo,
    leaderEmail,
    transactionID,
    members,
  } = req.body;

  // Validate required fields
  if (
    !projectName ||
    !category ||
    !description ||
    !leaderName ||
    !leaderDepartment ||
    !leaderRollNo ||
    !leaderPhoneNo ||
    !leaderEmail ||
    !transactionID
  ) {
    return res.status(400).json({
      message: "Please provide all required fields.",
    });
  }

  // Validate number of members
  if (members && members.length > 3) {
    return res.status(400).json({
      message: "A project can have a maximum of 3 members. Please remove extra members.",
    });
  }

  // Generate unique 4-digit ProjectID
  const projectID = await generateUniqueProjectID();

  // Create a new project document
  const project = await Data.create({
    projectID,
    projectName,
    category,
    description,
    leaderName,
    leaderDepartment,
    leaderRollNo,
    leaderPhoneNo,
    leaderEmail,
    transactionID,
    members,
  });

  // Nodemailer configuration
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use other services like Yahoo, Outlook, etc.
    auth: {
      user: "nirmaan.cyborg@gmail.com", // Replace with your email
      pass: "phylcgvdwlgknlqt", // Replace with your email password or app password
    },
  });

  const mailOptions = {
    from: "nirmaan.cyborg@gmail.com", // Sender email
    to: leaderEmail, // Recipient email
    subject: "Registration Confirmation - Project Competition",
    text: `Dear ${leaderName},
  
  Greetings from Electronics and Telecommunication Department!
  Congratulations! Your project "${projectName}" has been successfully registered for NIRMAAN 2025.
  
  Here are your project details:
  - Project ID: ${projectID} (Please keep this safe for future reference)
  - Category: ${category}
  - Description: ${description}
  
  Here is your team information:
  - Project Leader: ${leaderName})
  - Team Members:
    ${members.map((member, index) => `  ${index + 1}. ${member.name}`).join("\n")}
  
  Further details will be conveyed to you via email.
  Stay tuned for more updates! 
  We look forward to your participation!
  
  Best regards,
  Surabhi (President - Cyborg Club, E&TC department)
  9326004793
  `
  };
  

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({
        message: "Project created but failed to send confirmation email.",
        project,
      });
    } else {
      console.log("Email sent:", info.response);
      res.status(201).json({
        message: "Project created successfully and email sent to your address!",
        project,
      });
    }
  });
});





export const getCompetitionStats = async (req, res) => {
  try {
    // Fetch total number of registrations
    const totalRegistrations = await Data.countDocuments();

    // Calculate prize pool (₹200 per registration)
    const prizePoolCollected = totalRegistrations * 200;

    // Count projects based on category
    const hardwareProjects = await Data.countDocuments({ category: "Hardware" });
    const softwareProjects = await Data.countDocuments({ category: "Software" });

    // Count registrations from E&TC and other branches
    const entcRegistrations = await Data.countDocuments({ leaderDepartment: "E&TC" });
    const otherRegistrations = totalRegistrations - entcRegistrations;

    // Send response
    res.status(200).json({
      totalRegistrations,
      prizePoolCollected,
      hardwareProjects,
      softwareProjects,
      entcRegistrations,
      otherRegistrations
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching competition stats", details: error.message });
  }
};



//to get entc conacts
export const getENTCContacts = async (req, res) => {
  try {
    // Fetch projects where leaderDepartment is E&TC
    const entcProjects = await Data.find(
      { leaderDepartment: "E&TC" },
      { projectID: 1, leaderName: 1, leaderPhoneNo: 1, _id: 0 } // Select only required fields
    );

    // Send response
    res.status(200).json({ entcProjects });
  } catch (error) {
    res.status(500).json({ error: "Error fetching E&TC contacts", details: error.message });
  }
};


export const getOtherContacts = async (req, res) => {
  try {
    // Fetch projects where leaderDepartment is NOT E&TC
    const otherProjects = await Data.find(
      { leaderDepartment: { $ne: "E&TC" } }, // $ne (not equal) operator filters out E&TC
      { projectID: 1, leaderName: 1, leaderPhoneNo: 1, _id: 0 } // Select only required fields
    );

    // Send response
    res.status(200).json({ otherProjects });
  } catch (error) {
    res.status(500).json({ error: "Error fetching other department contacts", details: error.message });
  }
};






export const getEntcProjects = async (req, res) => {
  try {
    // Fetch projects where leaderDepartment is E&TC
    const entcProjects = await Data.find(
      { leaderDepartment: "E&TC" },
      { projectID: 1, projectName: 1, description: 1, _id: 0 } // Select only required fields
    );

    // Send response
    res.status(200).json({ entcProjects });
  } catch (error) {
    res.status(500).json({ error: "Error fetching E&TC projects", details: error.message });
  }
};






export const getOtherProjects = async (req, res) => {
  try {
    // Fetch projects where leaderDepartment is NOT E&TC
    const otherProjects = await Data.find(
      { leaderDepartment: { $ne: "E&TC" } }, // $ne (not equal) filters out E&TC
      { projectID: 1, projectName: 1, description: 1, _id: 0 } // Select only required fields
    );

    // Send response
    res.status(200).json({ otherProjects });
  } catch (error) {
    res.status(500).json({ error: "Error fetching other department projects", details: error.message });
  }
};
