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
    leaderName,
    leaderDepartment,
    leaderRollNo,
    leaderPhoneNo,
    leaderEmail,
    transactionID,
    member1,
    member2,
    member3
  } = req.body;

  // Validate required fields
  if (
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

  // Generate unique 4-digit ProjectID
  const projectID = await generateUniqueProjectID();

  // Create a new project document
  const project = await Data.create({
    projectID,
    leaderName,
    leaderDepartment,
    leaderRollNo,
    leaderPhoneNo,
    leaderEmail,
    transactionID,
    member1,
    member2,
    member3,
  });

  // Nodemailer configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nirmaan.cyborg@gmail.com",
      pass: "phylcgvdwlgknlqt",
    },
  });

  const mailOptions = {
    from: "nirmaan.cyborg@gmail.com",
    to: leaderEmail,
    subject: "Registration Confirmation - Project Competition",
    text: `Dear ${leaderName},

Greetings from Electronics and Telecommunication Department!
Congratulations! Your project has been successfully registered for NIRMAAN 2025.

Here are your project details:
- Project ID: ${projectID} (Please keep this safe for future reference)

Here is your team information:
- Project Leader: ${leaderName}
- Team Members:
  ${[member1, member2, member3].filter(Boolean).map((member, index) => `  ${index + 1}. ${member}`).join("\n")}

Further details will be conveyed to you via email.
Stay tuned for more updates! 
We look forward to your participation!

Best regards,  
Surabhi (President - Cyborg Club, E&TC department)  
9326004793`
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

    // Count registrations from E&TC and other branches
    const entcRegistrations = await Data.countDocuments({ leaderDepartment: "E&TC" });
    const otherRegistrations = totalRegistrations - entcRegistrations;

    // Send response
    res.status(200).json({
      totalRegistrations,
      prizePoolCollected,
      entcRegistrations,
      otherRegistrations
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching competition stats", details: error.message });
  }
};

// Get E&TC contacts
export const getENTCContacts = async (req, res) => {
  try {
    const entcContacts = await Data.find(
      { leaderDepartment: "E&TC" },
      { projectID: 1, leaderName: 1, leaderPhoneNo: 1, _id: 0 }
    );

    res.status(200).json({ entcContacts });
  } catch (error) {
    res.status(500).json({ error: "Error fetching E&TC contacts", details: error.message });
  }
};

// Get other department contacts
export const getOtherContacts = async (req, res) => {
  try {
    const otherContacts = await Data.find(
      { leaderDepartment: { $ne: "E&TC" } },
      { projectID: 1, leaderName: 1, leaderPhoneNo: 1, _id: 0 }
    );

    res.status(200).json({ otherContacts });
  } catch (error) {
    res.status(500).json({ error: "Error fetching other department contacts", details: error.message });
  }
};

// Get E&TC projects
export const getEntcProjects = async (req, res) => {
  try {
    const entcProjects = await Data.find(
      { leaderDepartment: "E&TC" },
      { projectID: 1, _id: 0 }
    );

    res.status(200).json({ entcProjects });
  } catch (error) {
    res.status(500).json({ error: "Error fetching E&TC projects", details: error.message });
  }
};

// Get other department projects
export const getOtherProjects = async (req, res) => {
  try {
    const otherProjects = await Data.find(
      { leaderDepartment: { $ne: "E&TC" } },
      { projectID: 1, _id: 0 }
    );

    res.status(200).json({ otherProjects });
  } catch (error) {
    res.status(500).json({ error: "Error fetching other department projects", details: error.message });
  }
};
