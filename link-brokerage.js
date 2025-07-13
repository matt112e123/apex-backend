const axios = require("axios");

exports.handler = async function (event, context) {
  try {
    const response = await axios.get(
      "https://api.snaptrade.com/api/v1/snapTrade/authorize",
      {
        userId: "'THE-APEX-INVESTOR-TEST-LCWOQ",
        clientId: "cL3Joma3IF2OygJLOcKvTezOVuVLhMtOPexMkxDrGX0WyZIl3e",
        redirectUri: "https://eloquent-fairy-053ab2.netlify.app/callback"
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-API-KEY": "YOUR_SNAPTRADE_API_KEY"
        }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ url: response.data.url })
    };
  } catch (error) {
    console.error("Error linking brokerage:", error.message, error.response?.data);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong while linking your portfolio." })
    };
  }
}