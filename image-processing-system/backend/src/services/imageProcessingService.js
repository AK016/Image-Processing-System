const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const Request = require("../models/requestModel");
const webhookController = require("../controllers/webhookController");

const OUTPUT_DIR = path.join(__dirname, "../../processed_images");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Process images asynchronously
exports.processImages = async (requestId, inputData) => {
  try {
    const outputData = [];

    for (const item of inputData) {
      const { "Serial Number": serialNumber, "Product Name": productName, "Input Image Urls": imageUrls } = item;
      const imageList = imageUrls.split(",").map((url) => url.trim());
      const processedImages = [];

      for (const imageUrl of imageList) {
        try {
          const response = await axios({ url: imageUrl, responseType: "arraybuffer" });
          const compressedImagePath = path.join(OUTPUT_DIR, `${serialNumber}_${Date.now()}.jpg`);

          await sharp(response.data).jpeg({ quality: 50 }).toFile(compressedImagePath);
          processedImages.push(compressedImagePath);
        } catch (error) {
          console.error(`Error processing image ${imageUrl}:`, error.message);
          processedImages.push("Error processing image");
        }
      }

      outputData.push({
        serialNumber,
        productName,
        inputImageUrls: imageList,
        outputImageUrls: processedImages,
      });
    }

    // Update database with processed data
    await Request.findOneAndUpdate({ requestId }, { status: "Completed", outputData });

    console.log(`✅ Processing completed for request ID: ${requestId}`);

    // Trigger webhook notification
    webhookController.sendWebhook(requestId);
  } catch (error) {
    console.error("❌ Image processing failed:", error);
    await Request.findOneAndUpdate({ requestId }, { status: "Failed" });
  }
};
