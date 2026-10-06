export default function handler(req, res) {
  return res.status(200).json({
    hasGeminiKey: false,
    keyPreview: "Not Configured",
    smartEngineReady: true
  });
}
