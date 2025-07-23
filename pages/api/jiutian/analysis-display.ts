export default async function handler(req, res) {
  const token = process.env.JIUTIAN_JWT;
  const workflow_id = process.env.JIUTIAN_ANALYSIS_DISPLAY_ID;
  const { structured_json } = req.body;

  const response = await fetch('https://jiutian.10086.cn/largemodel/api/v2/workflow/run', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workflow_id,
      params: { input: structured_json },
    })
  });
  const data = await response.json();
  res.status(200).json(data);
} 