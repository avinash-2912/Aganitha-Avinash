import axios from 'axios';

const APIkey = '424ac4cccad9340ba54f23d383cb2b5a';

const WeatherData = {
  getCurrentWeather: async (location) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIkey}&units=metric`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(
        'Error fetching current weather. Please try another location.'
      );
    }
  },
  getThreeDayForecast: async (location) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${APIkey}&units=metric`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching 3-day forecast.');
    }
  },
  getWeatherByCoordinates: async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(
        'Error fetching weather by coordinates. Please try again.'
      );
    }
  },
  getThreeDayForecastByCoordinates: async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching 3-day forecast by coordinates.');
    }
  },
};

export default WeatherData;
