const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["Processing", "Completed", "Failed"], default: "Processing" },
  inputData: {
    type: [
      {
        serialNumber: { type: String, required: true },
        productName: { type: String, required: true },
        imageUrls: { type: [String], required: true }, // Store multiple image URLs
      },
    ],
    required: true,
  },
  outputData: {
    type: [
      {
        serialNumber: { type: String, required: true },
        productName: { type: String, required: true },
        processedImagePaths: { type: [String], required: true }, // Store processed image paths
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Request", requestSchema);
