const API_KEY = "90674a86b26f06c6f5cabafe0a3edeec"; 
const COUNTRY_CODE = "NL";

async function fetchWeather() {
  const searchInput = document.getElementById("search").value.trim();
  const weatherDataSection = document.getElementById("weather-data");
  
  // Reset display
  weatherDataSection.style.display = "block";

  // 1. Input Validation
  if (!searchInput) {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  try {
    // 2. Fetch Geolocation Data
    const encodedCity = encodeURIComponent(searchInput);
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodedCity},${COUNTRY_CODE}&limit=1&appid=${API_KEY}`;
    
    const geoResponse = await fetch(geocodeURL);
    if (!geoResponse.ok) {
      throw new Error(`Geocoding failed with status: ${geoResponse.status}`);
    }
    
    const geoData = await geoResponse.json();
    
    if (geoData.length === 0) {
      weatherDataSection.innerHTML = `
        <div>
          <h2>Invalid Input: "${searchInput}"</h2>
          <p>We couldn't find a city by that name in the Netherlands. Please try again.</p>
        </div>
      `;
      return;
    }

    const { lat, lon } = geoData[0];

    // 3. Fetch Weather Data
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const weatherResponse = await fetch(weatherURL);
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather fetch failed with status: ${weatherResponse.status}`);
    }
    
    const weatherData = await weatherResponse.json();

    // 4. Update the DOM
    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}" width="100" />
      <div>
        <h2>${weatherData.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(weatherData.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${weatherData.weather[0].description}</p>
      </div>
    `;

    // Clear the input only after a successful fetch
    document.getElementById("search").value = "";

  } catch (error) {
    // 5. Handle Network/Code Errors Gracefully
    console.error("Weather App Error:", error);
    weatherDataSection.innerHTML = `
      <div>
        <h2>Connection Error</h2>
        <p>Something went wrong while fetching the weather. Please check your connection and try again.</p>
      </div>
    `;
  }
}
