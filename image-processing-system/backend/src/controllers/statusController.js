const Request = require("../models/requestModel");

// Define the getStatus function
const getStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findOne({ requestId });

    if (!request) {
      return res.status(404).json({ error: "Request ID not found" });
    }

    res.json({ requestId, status: request.status });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = { getStatus };
