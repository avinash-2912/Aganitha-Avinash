import React, { useState } from 'react';
import {
  BsSnow2,
  BsFillSunFill,
  BsFillCloudSunFill,
  BsFillCloudRainFill,
} from 'react-icons/bs';
import { RiCloudWindyLine } from 'react-icons/ri';
import WeatherData from './WeatherData';

export const WeatherDashboard = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('celsius');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUnitChange = (unit) => {
    setSelectedUnit(unit);
  };

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    if (!newLocation) {
      setWeatherData(null);
      setForecastData(null);
    }
  };

  const convertTemperature = (value) => {
    const celsius = value;
    if (selectedUnit === 'celsius') {
      return `${celsius.toFixed(1)} °C`;
    } else {
      const fahrenheit = (celsius * 9) / 5 + 32;
      return `${fahrenheit.toFixed(1)} °F`;
    }
  };

  const getWeatherIcon = (weatherCondition) => {
    switch (weatherCondition) {
      case 'Snow':
        return <BsSnow2 />;
      case 'Clouds':
        return <RiCloudWindyLine />;
      case 'Clear':
        return <BsFillSunFill />;
      case 'Rain':
        return <BsFillCloudRainFill />;
      default:
        return <BsFillCloudSunFill />;
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setIsLoading(true);

      const currentWeather = await WeatherData.getCurrentWeather(location);
      const threeDayForecast = await WeatherData.getThreeDayForecast(location);

      setWeatherData(currentWeather);
      setForecastData(threeDayForecast);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherBackgroundColor = (weatherCondition) => {
    switch (weatherCondition) {
      case 'Snow':
        return 'bg-blue-200';
      case 'Clouds':
        return 'bg-gray-200';
      case 'Clear':
        return 'bg-yellow-200';
      case 'Rain':
        return 'bg-gray-300';
      default:
        return 'bg-gray-200';
    }
  };

  const handleAutoLocate = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const currentWeather = await WeatherData.getWeatherByCoordinates(
            lat,
            lon
          );
          const threeDayForecast =
            await WeatherData.getThreeDayForecastByCoordinates(lat, lon);
          setWeatherData(currentWeather);
          setForecastData(threeDayForecast);
        },
        (error) => {
          setError(error);
        }
      );
    } else {
      setError(new Error('Geolocation is not supported by this browser.'));
    }
  };

  const weatherGIFs = {
    Snow: 'https://giphy.com/embed/IiG1Moma7qgN2',
    Rain: 'https://giphy.com/embed/l2ir9TVxVFOcDzMAzB',
    Clear: 'https://giphy.com/embed/1Fm7jEapE18HwS6fkT',
  };

  const currentGIF = weatherGIFs[weatherData?.weather[0]?.main] || '';

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start py-8 px-4 ${getWeatherBackgroundColor(
        weatherData?.weather[0]?.main
      )} transition duration-500 ease-in-out`}
      style={{ transition: 'background 0.5s ease-in-out' }}
    >
      <h1 className="text-5xl font-bold text-gray-800 mb-8 text-center w-full md:w-auto">
        Weather Dashboard
      </h1>

      <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
        <form
          onSubmit={handleSearch}
          className="w-full flex flex-col sm:flex-row gap-4"
        >
          <input
            type="search"
            value={location}
            onChange={handleLocationChange}
            placeholder="Enter city or zip code"
            className="px-4 py-2 flex-1 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-600 transition"
          >
            Search
          </button>
        </form>
        <button
          onClick={handleAutoLocate}
          className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold shadow-lg hover:bg-green-600 transition"
        >
          Use My Location
        </button>

        <div className="flex gap-4">
          <button
            onClick={() => handleUnitChange('celsius')}
            className={`px-4 py-2 rounded-full font-semibold ${
              selectedUnit === 'celsius'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-600'
            } transition`}
          >
            °C
          </button>
          <button
            onClick={() => handleUnitChange('fahrenheit')}
            className={`px-4 py-2 rounded-full font-semibold ${
              selectedUnit === 'fahrenheit'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-600'
            } transition`}
          >
            °F
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center mt-8">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {weatherData && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-8 w-full max-w-md relative">
          {currentGIF && (
            <div className="rounded-full overflow-hidden mb-4 w-24 h-24 mx-auto">
              <iframe
                src={currentGIF}
                width="100%"
                height="100%"
                frameBorder="0"
                className="giphy-embed rounded-full overflow-hidden"
                allowFullScreen
                title="Weather GIF"
              ></iframe>
            </div>
          )}
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Current Weather
            </h2>
            <div className="text-6xl mb-4">
              {getWeatherIcon(weatherData.weather[0].main)}
            </div>
            <p className="text-xl font-semibold mb-2">
              {convertTemperature(weatherData.main.temp)}
            </p>
            <p className="mb-1">Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>
        </div>
      )}

      {forecastData && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
          {forecastData.list.slice(0, 3).map((item, index) => {
            const forecastDate = new Date();
            forecastDate.setDate(forecastDate.getDate() + index + 1);
            return (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center text-gray-600"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {formatDate(forecastDate)}
                </h3>
                <div className="text-5xl mb-2">
                  {getWeatherIcon(item.weather[0].main)}
                </div>
                <p className="text-xl mb-1">
                  {convertTemperature(item.main.temp)}
                </p>
                <p>Humidity: {item.main.humidity}%</p>
                <p>Wind Speed: {item.wind.speed} m/s</p>
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <div className="mt-8 p-4 bg-red-500 text-white rounded-lg">
          {error.message}
        </div>
      )}
    </div>
  );
};
