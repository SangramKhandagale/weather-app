import { useState, useEffect } from "react";
import "./App.css";

function WeatherApp() {
  const [weatherInfo, setWeatherInfo] = useState({
    city: "Mumbai",
    feelslike: 23,
    temp: 25,
    tempMin: 25,
    tempMax: 35,
    humidity: 47,
    weather: "haze",
    wind: 5.2,
    pressure: 1012,
    icon: "50d", // Default icon code
    country: "IN",
    sunrise: 1609722340,
    sunset: 1609763140,
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString()
  });

  const [city, setCity] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("metric"); // metric or imperial
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [forecast, setForecast] = useState([]);

  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
  const API_KEY = "4299fdb99bba3879b32a664465eb7f3d";

  // Get user's current location on initial load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        getWeatherByCoords(position.coords.latitude, position.coords.longitude);
      }, (error) => {
        console.error("Error getting location:", error);
      });
    }
    
    // Check for system dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
    
    // Set up time updates
    const timeInterval = setInterval(() => {
      setWeatherInfo(prev => ({
        ...prev,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
      }));
    }, 1000);
    
    return () => clearInterval(timeInterval);
  }, []);

  // Apply dark mode class when state changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Weather conditions determine app background and theme
  useEffect(() => {
    const weatherMain = weatherInfo.weather?.toLowerCase() || "";
    document.body.className = `${isDarkMode ? 'dark-mode' : ''} weather-${getWeatherConditionClass(weatherMain)}`;
  }, [weatherInfo.weather, isDarkMode]);

  const getWeatherConditionClass = (condition) => {
    if (condition.includes("clear")) return "clear";
    if (condition.includes("cloud")) return "cloudy";
    if (condition.includes("rain") || condition.includes("drizzle")) return "rainy";
    if (condition.includes("thunder")) return "stormy";
    if (condition.includes("snow")) return "snowy";
    if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) return "foggy";
    return "default";
  };

  const getWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      let response = await fetch(`${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`);
      let jsonResponse = await response.json();
      
      // Also get 5-day forecast
      let forecastResponse = await fetch(`${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`);
      let forecastData = await forecastResponse.json();
      
      processWeatherData(jsonResponse);
      processForecastData(forecastData);
      setError(false);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherInfo = async () => {
    setLoading(true);
    try {
      let response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=${unit}`);
      let jsonResponse = await response.json();
      
      if (jsonResponse.cod === "404") {
        setError(true);
        setLoading(false);
        return null;
      }
      
      // Also get 5-day forecast
      let forecastResponse = await fetch(`${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=${unit}`);
      let forecastData = await forecastResponse.json();
      
      processWeatherData(jsonResponse);
      processForecastData(forecastData);
      return jsonResponse;
    } catch (err) {
      setError(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const processWeatherData = (data) => {
    if (!data) return;
    
    let result = {
      city: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      feelslike: Math.round(data.main.feels_like),
      weather: data.weather[0].description,
      icon: data.weather[0].icon,
      wind: data.wind.speed,
      pressure: data.main.pressure,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    };
    
    setWeatherInfo(result);
  };

  const processForecastData = (data) => {
    if (!data || !data.list) return;
    
    // Get one forecast per day (noon time)
    const dailyForecasts = data.list.filter((item, index) => {
      const date = new Date(item.dt * 1000);
      return date.getHours() >= 12 && date.getHours() <= 15;
    }).slice(0, 5);
    
    const formattedForecast = dailyForecasts.map(item => ({
      date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      weather: item.weather[0].description
    }));
    
    setForecast(formattedForecast);
  };

  const handleChange = (evt) => {
    setCity(evt.target.value);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!city.trim()) return;
    
    const data = await getWeatherInfo();
    if (data) {
      setCity("");
      setError(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const toggleUnit = () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    // Re-fetch weather with new unit
    if (city) {
      setCity(weatherInfo.city);
      setTimeout(() => getWeatherInfo(), 100);
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        getWeatherByCoords(position.coords.latitude, position.coords.longitude);
      });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="weather-app">
      <div className="weather-container">
        <header className="app-header">
          <h1>Weather<span>Pulse</span></h1>
          <div className="controls">
            <button className="toggle-btn" onClick={toggleUnit}>
              {unit === "metric" ? "°C" : "°F"}
            </button>
            <button className="toggle-btn dark-mode-toggle" onClick={toggleDarkMode}>
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <div className="search-section">
          <form onSubmit={handleSubmit}>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for a city..."
                value={city}
                onChange={handleChange}
                required
              />
              <button type="submit" className="search-btn">
                {loading ? <span className="loader"></span> : <span>🔍</span>}
              </button>
            </div>
            {error && <p className="error-message">City not found. Try another location.</p>}
          </form>
        </div>

        <main>
          <div className="current-weather glass-card">
            <div className="weather-header">
              <div>
                <h2>{weatherInfo.city}, {weatherInfo.country}</h2>
                <p className="date-time">{weatherInfo.date} | {weatherInfo.time}</p>
              </div>
              <div className="weather-icon">
                <img 
                  src={`https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`} 
                  alt={weatherInfo.weather} 
                />
              </div>
            </div>

            <div className="weather-info">
              <div className="temperature">
                <h2>{weatherInfo.temp}{unit === "metric" ? "°C" : "°F"}</h2>
                <p className="weather-description">{weatherInfo.weather}</p>
              </div>
              <div className="weather-details">
                <div className="detail">
                  <span className="label">Feels Like</span>
                  <span className="value">{weatherInfo.feelslike}{unit === "metric" ? "°C" : "°F"}</span>
                </div>
                <div className="detail">
                  <span className="label">Humidity</span>
                  <span className="value">{weatherInfo.humidity}%</span>
                </div>
                <div className="detail">
                  <span className="label">Wind</span>
                  <span className="value">{weatherInfo.wind} {unit === "metric" ? "m/s" : "mph"}</span>
                </div>
                <div className="detail">
                  <span className="label">Pressure</span>
                  <span className="value">{weatherInfo.pressure} hPa</span>
                </div>
              </div>
            </div>

            <div className="sun-times">
              <div className="sun-time">
                <span className="sun-icon sunrise">🌅</span>
                <span>Sunrise: {formatTime(weatherInfo.sunrise)}</span>
              </div>
              <div className="sun-time">
                <span className="sun-icon sunset">🌇</span>
                <span>Sunset: {formatTime(weatherInfo.sunset)}</span>
              </div>
            </div>
          </div>

          <div className="forecast-section">
            <h3>5-Day Forecast</h3>
            <div className="forecast-container">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-card glass-card">
                  <p className="day">{day.date}</p>
                  <img 
                    src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
                    alt={day.weather} 
                  />
                  <p className="forecast-temp">{day.temp}{unit === "metric" ? "°C" : "°F"}</p>
                  <p className="forecast-desc">{day.weather}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer>
          <p>WeatherPulse &copy; {new Date().getFullYear()} | Made By:Mrudula Patil</p>
        </footer>
      </div>
    </div>
  );
}

export default WeatherApp;