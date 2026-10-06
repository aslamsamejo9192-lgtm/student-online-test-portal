export default function handler(req, res) {
  const { apiKey } = req.body || {};
  return res.status(200).json({
    success: true,
    message: "Key registered for session",
    keyPreview: apiKey ? `${apiKey.substring(0, 6)}...` : "Saved"
  });
}
