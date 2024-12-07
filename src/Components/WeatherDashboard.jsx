import React, { useState, useEffect } from 'react';
import {
  BsSnow2,
  BsFillSunFill,
  BsFillCloudSunFill,
  BsFillCloudRainFill,
} from 'react-icons/bs';
import { RiCloudWindyLine } from 'react-icons/ri';
import WeatherData from './WeatherData';

const WeatherDashboard = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('celsius');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem('weather-favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const handleUnitChange = (unit) => setSelectedUnit(unit);

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
      setError('Unable to fetch weather data. Please try again.');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoLocate = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            setError(null);
            const currentWeather = await WeatherData.getWeatherByCoordinates(
              lat,
              lon
            );
            const threeDayForecast =
              await WeatherData.getThreeDayForecastByCoordinates(lat, lon);
            setWeatherData(currentWeather);
            setForecastData(threeDayForecast);
          } catch (error) {
            setError('Failed to fetch data using geolocation.');
            setWeatherData(null);
            setForecastData(null);
          }
        },
        () => setError('Geolocation is not supported or permission denied.')
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const getGif = () => {
    const condition = weatherData.weather[0]?.main.toLowerCase();
    let gifURL;

    switch (condition) {
      case 'clear':
        gifURL = 'https://media.giphy.com/media/1Fm7jEapE18HwS6fkT/giphy.gif';
        break;
      case 'clouds':
        gifURL = 'https://media.giphy.com/media/gjUHpcyu6cdZdNtmkV/giphy.gif';
        break;
      case 'rain':
        gifURL = 'https://media.giphy.com/media/l2ir9TVxVFOcDzMAzG/giphy.gif';
        break;
      case 'snow':
        gifURL = 'https://media.giphy.com/media/IiG1Moma7qgN2/giphy.gif';
        break;
      default:
        gifURL = 'https://media.giphy.com/media/gjUHpcyu6cdZdNtmkV/giphy.gif';
        break;
    }

    return gifURL;
  };

  const getWeatherCardColor = (weatherCondition) => {
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

  const addFavorite = () => {
    if (weatherData && !favorites.includes(weatherData.name)) {
      const updatedFavorites = [...favorites, weatherData.name];
      setFavorites(updatedFavorites);
      localStorage.setItem(
        'weather-favorites',
        JSON.stringify(updatedFavorites)
      );
    }
  };

  const removeFavorite = (locationName) => {
    const updatedFavorites = favorites.filter((fav) => fav !== locationName);
    setFavorites(updatedFavorites);
    localStorage.setItem('weather-favorites', JSON.stringify(updatedFavorites));
  };

  const handleFavoriteClick = async (locationName) => {
    try {
      setError(null);
      setIsLoading(true);

      const currentWeather = await WeatherData.getCurrentWeather(locationName);
      const threeDayForecast = await WeatherData.getThreeDayForecast(locationName);

      setWeatherData(currentWeather);
      setForecastData(threeDayForecast);
    } catch (error) {
      setError('Unable to fetch weather data for the selected favorite. Please try again.');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 bg-gradient-to-b from-blue-200 to-indigo-500 text-gray-800">
      <h1 className="text-5xl font-extrabold mb-6">🌤️ Weather Dashboard 🌧️</h1>

      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            placeholder="Enter city or zip code"
            className="flex-1 p-3 rounded border border-gray-300 focus:ring focus:ring-blue-400 outline-none"
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </form>
        <button
          onClick={handleAutoLocate}
          className="p-3 w-full bg-green-500 text-white rounded hover:bg-green-600 mb-4"
        >
          Use My Location 📍
        </button>
        <div className="mb-4 flex items-center justify-center">
          <div className="flex items-center">
            <label
              htmlFor="celsius"
              className={`radio-label ${
                selectedUnit === 'celsius'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              } px-4 py-2 rounded-full cursor-pointer mr-2 transition duration-300 ease-in-out transform hover:scale-105`}
            >
              <input
                type="radio"
                id="celsius"
                value="celsius"
                checked={selectedUnit === 'celsius'}
                onChange={() => handleUnitChange('celsius')}
                className="hidden"
              />
              °C
            </label>
            <label
              htmlFor="fahrenheit"
              className={`radio-label ${
                selectedUnit === 'fahrenheit'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              } px-4 py-2 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:scale-105`}
            >
              <input
                type="radio"
                id="fahrenheit"
                value="fahrenheit"
                checked={selectedUnit === 'fahrenheit'}
                onChange={() => handleUnitChange('fahrenheit')}
                className="hidden"
              />
              °F
            </label>
          </div>
        </div>

        {favorites.length > 0 && (
          <div className="flex flex-col mt-6">
            <h3 className="text-xl font-semibold">Favorite Locations:</h3>
            <ul className="list-none">
              {favorites.map((favorite) => (
                <li key={favorite} className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => handleFavoriteClick(favorite)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {favorite}
                  </button>
                  <button
                    onClick={() => removeFavorite(favorite)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isLoading ? (
        <p className="text-lg mt-4">Loading...</p>
      ) : error ? (
        <p className="text-lg mt-4 text-red-500">{error}</p>
      ) : weatherData ? (
        <div
          className={`mt-8 ${getWeatherCardColor(
            weatherData.weather[0]?.main
          )} p-6 rounded-lg shadow-md flex items-center gap-4`}
        >
          <div>
            {getWeatherIcon(weatherData.weather[0]?.main)}
            <h2 className="text-2xl font-bold">
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <p className="text-lg">Date: {formatDate(new Date())}</p>
            <p className="text-lg">
              Temperature: {convertTemperature(weatherData.main.temp)}
            </p>
            <p className="text-lg">Humidity: {weatherData.main.humidity}%</p>
            <p className="text-lg">Wind Speed: {weatherData.wind.speed} m/s</p>
            <button
              onClick={addFavorite}
              className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add to Favorites
            </button>
          </div>
          <div className="flex-1">
            <img
              src={getGif()}
              alt="Weather Condition"
              className="rounded-lg shadow-md w-full h-64 object-cover"
            />
          </div>
        </div>
      ) : (
        <p className="text-lg mt-4">
          Please enter a location and press search.
        </p>
      )}

      {forecastData && forecastData.list.slice(0, 3).length > 0 && (
        <>
          <h3 className="text-xl font-semibold mt-4">3-Day Forecast:</h3>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {forecastData?.list.slice(0, 3).map((dayForecast, index) => {
              const forecastDate = new Date(dayForecast.dt * 1000);
              forecastDate.setDate(new Date().getDate() + index + 1);

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg shadow-md ${getWeatherCardColor(
                    dayForecast.weather[0]?.main
                  )}`}
                >
                  <div className="text-4xl">
                    {getWeatherIcon(dayForecast.weather[0]?.main)}
                  </div>
                  <h4 className="text-lg font-bold">
                    {formatDate(forecastDate)}
                  </h4>
                  <p className="text-md">
                    {dayForecast.weather[0]?.description}
                  </p>
                  <p className="text-md">
                    Temp: {convertTemperature(dayForecast.main.temp)}
                  </p>
                  <p>Wind: {dayForecast.wind.speed} m/s</p>
                  <p>Humidity: {dayForecast.main.humidity}%</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherDashboard;
