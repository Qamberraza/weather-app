// const APIKEY = "3143a9fa311499ee2976be856df11060";
// const city = "New York";
// const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`;

// fetch(url)
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error(error));





// Weather App JavaScript
const APIKEY = "3143a9fa311499ee2976be856df11060";

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContent = document.getElementById('weatherContent');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');

// Weather data elements
const cityName = document.getElementById('cityName');
const countryName = document.getElementById('countryName');
const currentDate = document.getElementById('currentDate');
const currentTime = document.getElementById('currentTime');
const weatherIcon = document.getElementById('weatherIcon');
const mainTemp = document.getElementById('mainTemp');
const weatherDesc = document.getElementById('weatherDesc');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const cloudiness = document.getElementById('cloudiness');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');

// Weather icon mapping
const weatherIcons = {
    '01d': 'fas fa-sun',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud',
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-rain',
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    fetchWeatherData('New York'); // Default city
    
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    currentDate.textContent = now.toLocaleDateString('en-US', options);
    currentTime.textContent = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
}

// Handle search
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
        cityInput.value = '';
    }
}

// Show loading state
function showLoading() {
    weatherContent.style.display = 'none';
    errorMessage.classList.remove('show');
    loading.classList.add('show');
}

// Show weather content
function showWeatherContent() {
    loading.classList.remove('show');
    errorMessage.classList.remove('show');
    weatherContent.style.display = 'block';
}

// Show error message
function showError() {
    loading.classList.remove('show');
    weatherContent.style.display = 'none';
    errorMessage.classList.add('show');
}

// Fetch weather data
async function fetchWeatherData(city) {
    showLoading();
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.cod === 200) {
            updateWeatherDisplay(data);
            showWeatherContent();
        } else {
            throw new Error(data.message || 'Weather data not found');
        }
        
    } catch (error) {
        console.error('Weather fetch failed:', error);
        showError();
    }
}

// Update weather display
function updateWeatherDisplay(data) {
    // Location info
    cityName.textContent = data.name;
    countryName.textContent = data.sys.country;
    
    // Weather icon
    const iconCode = data.weather[0].icon;
    const iconClass = weatherIcons[iconCode] || 'fas fa-question';
    weatherIcon.className = iconClass;
    
    // Temperature
    mainTemp.textContent = Math.round(data.main.temp);
    
    // Weather description
    weatherDesc.textContent = data.weather[0].description;
    
    // Weather details
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    cloudiness.textContent = `${data.clouds.all}%`;
    
    // Sun times
    const sunriseTime = new Date(data.sys.sunrise * 1000);
    const sunsetTime = new Date(data.sys.sunset * 1000);
    
    sunrise.textContent = sunriseTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    sunset.textContent = sunsetTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Update background based on weather
    updateBackgroundGradient(data.weather[0].main, data.weather[0].icon);
}

// Update background gradient based on weather
function updateBackgroundGradient(weatherMain, iconCode) {
    const body = document.body;
    const isNight = iconCode.includes('n');
    
    let gradient;
    
    switch(weatherMain.toLowerCase()) {
        case 'clear':
            gradient = isNight 
                ? 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            break;
        case 'clouds':
            gradient = 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)';
            break;
        case 'rain':
        case 'drizzle':
            gradient = 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)';
            break;
        case 'thunderstorm':
            gradient = 'linear-gradient(135deg, #141e30 0%, #243b55 100%)';
            break;
        case 'snow':
            gradient = 'linear-gradient(135deg, #e6ddd4 0%, #d5d4d0 100%)';
            break;
        case 'mist':
        case 'fog':
        case 'haze':
            gradient = 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)';
            break;
        default:
            gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    body.style.background = gradient;
}

// Add some nice animations for interactions
function addInteractionEffects() {
    const detailCards = document.querySelectorAll('.detail-card');
    
    detailCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize interaction effects
document.addEventListener('DOMContentLoaded', addInteractionEffects);
