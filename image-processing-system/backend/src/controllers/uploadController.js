const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Request = require("../models/requestModel");
const sharp = require("sharp"); // Image processing library
const csv = require("csv-parser"); // CSV parsing library
const { parse } = require("json2csv"); // CSV generation library

exports.uploadCSV = (req, res) => {
  console.log("📤 Upload request received...");

  const requestId = uuidv4(); // Generate unique request ID
  const uploadDir = path.join(__dirname, "../../uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("📁 Created missing 'uploads' directory.");
  }

  const filePath = path.join(uploadDir, `${requestId}.csv`);
  const fileStream = fs.createWriteStream(filePath);

  req.on("data", (chunk) => {
    console.log(`📦 Received chunk of ${chunk.length} bytes`);
    fileStream.write(chunk);
  });

  req.on("end", async () => {
    fileStream.end();
    console.log(`✅ File uploaded successfully: ${filePath}`);

    const validData = await validateCSV(filePath);

    if (!validData.isValid) {
      return res.status(400).json({ error: validData.error });
    }

    const processedImages = await processImages(validData.data);

    await storeProcessedData(processedImages);

    const newRequest = new Request({
      requestId,
      status: "Completed",
      inputData: validData.data,
      outputData: processedImages,
    });

    await newRequest.save();

    const outputCsv = await generateOutputCSV(processedImages);

    const outputCsvPath = path.join(uploadDir, `${requestId}-processed.csv`);
    fs.writeFileSync(outputCsvPath, outputCsv);
    console.log(`✅ Output CSV saved successfully: ${outputCsvPath}`);

    res.json({
      message: "File uploaded and processed successfully!",
      requestId,
      outputCsvPath,
    });
  });

  req.on("error", (err) => {
    console.error("⛔ File upload error:", err);
    res.status(500).json({ error: "File upload failed" });
  });
};

const validateCSV = (filePath) => {
  return new Promise((resolve) => {
    const data = [];
    const errors = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (!row["Serial Number"] || !row["Product Name"] || !row["Input Image Urls"]) {
          errors.push("Missing required fields in CSV row");
        } else {
          const imageUrls = row["Input Image Urls"].split(",").map((url) => url.trim());
          data.push({
            serialNumber: row["Serial Number"],
            productName: row["Product Name"],
            imageUrls: imageUrls,
          });
        }
      })
      .on("end", () => {
        if (errors.length > 0) {
          resolve({ isValid: false, error: errors.join(", ") });
        } else {
          resolve({ isValid: true, data });
        }
      })
      .on("error", (err) => {
        resolve({ isValid: false, error: "CSV file read error: " + err.message });
      });
  });
};

const processImages = (data) => {
  return Promise.all(
    data.map(async (row) => {
      const processedImagePaths = [];

      for (const imageUrl of row.imageUrls) {
        try {
          const imagePath = path.join(__dirname, "../../uploads", uuidv4() + ".jpg");

          await sharp(imageUrl)
            .resize({ width: 800 })
            .jpeg({ quality: 50 })
            .toFile(imagePath);

          processedImagePaths.push(imagePath);
        } catch (error) {
          console.error(`⛔ Error processing image ${imageUrl}:`, error);
        }
      }

      return { ...row, processedImagePaths };
    })
  );
};

const storeProcessedData = async (processedImages) => {
  const productInfo = processedImages.map(async (image) => {
    if (image.processedImagePaths.length > 0) {
      await Product.create({
        serialNumber: image.serialNumber,
        name: image.productName,
        imagePaths: image.processedImagePaths,
      });
    }
  });

  await Promise.all(productInfo);
};

// Generate Output CSV with processed image URLs
const generateOutputCSV = (processedImages) => {
  const outputData = processedImages.map((image) => ({
    serialNumber: image.serialNumber,
    productName: image.productName,
    inputImageUrls: image.imageUrls.join(", "),
    outputImageUrls: image.processedImagePaths.join(", "),
  }));

  return parse(outputData);
};
