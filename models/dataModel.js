import mongoose from 'mongoose';

// Custom validator to enforce a maximum of 3 members
function arrayLimit(val) {
  return val.length <= 3;
}

// Define the project schema
const DataSchema = new mongoose.Schema(
  {
    projectID: {
      type: Number,
      unique: true,
      required: true,
      min: 1000,
      max: 9999
    },
    projectName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    leaderName: {
      type: String,
      required: true,
    },
    leaderDepartment: {
      type: String,
      required: true,
    },
    leaderRollNo: {
      type: String,
      required: true,
    },
    leaderPhoneNo: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); // Ensures a 10-digit phone number
        },
        message: "Phone number must be 10 digits.",
      },
    },
    leaderEmail: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Validates email format
        },
        message: "Invalid email format.",
      },
    },
    transactionID: {
      type: String,
      required: true,
    },
    members: {
      type: [
        {
          memberNo: {
            type: Number,
            required: true,
          },
          rollNo: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
        },
      ],
      validate: [arrayLimit, "{PATH} exceeds the limit of 3 members"], // Custom validator
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the model
const Data = mongoose.model("Data", DataSchema);

export default Data;
