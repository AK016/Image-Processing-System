const webhookReceiver = async (req, res) => {
  try {
    console.log("Webhook received:", req.body);
    res.status(200).json({ message: "Webhook received successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = { webhookReceiver };
