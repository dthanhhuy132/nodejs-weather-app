require("dotenv").config();
const asyncRequest = require("async-request");
const express = require("express");
const path = require("path");

const app = express();
// static file
const publicPath = path.join(__dirname, "../../public");
app.use(express.static(publicPath));

// set engine
app.set("template engine", "hbs");

const port = 7000;
app.get("/", async (req, res) => {
  const location = req.query.address;
  if (location) {
    const weather = await getWeather(location);
    res.render("weather.hbs", {
      status: true,
      weather: weather.region,
      country: weather.country,
      wind_speed: weather.wind_speed,
      uv_index: weather.uv_index,
      cloudcover: weather.cloudcover,
      precip: weather.precip,
      pressure: weather.pressure,
    });
  } else {
    res.render("weather.hbs", {
      status: false,
    });
  }
});

app.listen(port, () => {
  console.log("app listen at port: ", port);
});

// get weather function
async function getWeather(location = "tokyo") {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.accessKey}&query=${location}`;

  try {
    const res = await asyncRequest(url);
    const data = JSON.parse(res.body);

    const weather = {
      isSuccess: true,
      region: data.location.name,
      country: data.location.country,
      wind_speed: data.current.wind_speed,
      uv_index: data.current.uv_index,
      cloudcover: data.current.cloudcover,
      precip: data.current.precip,
      pressure: data.current.pressure,
    };

    return weather;
  } catch (error) {
    return {
      isSuccess: false,
      error: error,
    };
  }
}

getWeather();
