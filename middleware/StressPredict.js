const axios = require('axios');

const FLASK_URL = "https:///cb680af6b10f.ngrok-free.app/predict-stress";

async function getStressPrediction(data) {
  try {
    const response = await axios.post(FLASK_URL, data);
    console.log("Predicted Stress Level:", response.data.stressLevel);
  } catch (error) {
    console.error("Error predicting stress:", error.message);
  }
}


module.exports = getStressPrediction;
