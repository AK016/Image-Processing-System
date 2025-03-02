const express = require("express");
const multer = require("multer");

const uploadController = require("../controllers/uploadController");
const statusController = require("../controllers/statusController");
const webhookController = require("../controllers/webhookController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

console.log("uploadController:", uploadController);
console.log("statusController:", statusController);
console.log("webhookController:", webhookController);

router.post("/upload", upload.single("file"), uploadController.uploadCSV);
router.get("/status/:requestId", statusController.getStatus);
router.post("/webhook", webhookController.webhookReceiver);

module.exports = router;
