
const API_KEY = '85d529e1b1c742aeea7cea7e11cf365c';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';


const cityInput = document.getElementById('cityInput');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const weatherResult = document.getElementById('weatherResult');


async function getWeather() {
    const city = cityInput.value.trim();
    
    
    if (city === '') {
        alert('Please enter a city name!');
        return;
    }
    
    
    weatherResult.innerHTML = '<div class="loading show">⏳ Loading weather data...</div>';
    weatherResult.classList.add('show');
    
    try {
        
        const response = await fetch(
            `${API_URL}?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found! Please check the spelling.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Get one at openweathermap.org');
            } else {
                throw new Error('Something went wrong. Please try again.');
            }
        }
        
        
        const data = await response.json();
        
        
        displayWeather(data);
        
    } catch (error) {
        
        weatherResult.innerHTML = `<div class="error show">❌ ${error.message}</div>`;
        weatherResult.classList.add('show');
    }
}


function displayWeather(data) {
    
    const weatherId = data.weather[0].id;
    const emoji = getWeatherEmoji(weatherId);
    
    
    weatherResult.innerHTML = `
        <div class="weather-icon">${emoji}</div>
        <h2 id="cityName">${data.name}, ${data.sys.country}</h2>
        <div id="temperature">${Math.round(data.main.temp)}°C</div>
        <p id="description">${data.weather[0].description}</p>
        <p id="humidity">💧 Humidity: ${data.main.humidity}%</p>
        <p style="margin-top: 5px; color: #666;">
            🌡️ Feels like: ${Math.round(data.main.feels_like)}°C
        </p>
        <p style="color: #666;">
            💨 Wind: ${Math.round(data.wind.speed * 3.6)} km/h
        </p>
    `;
    
    weatherResult.classList.add('show');
}


function getWeatherEmoji(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return '⛈️'; 
    if (weatherId >= 300 && weatherId < 400) return '🌧️'; 
    if (weatherId >= 500 && weatherId < 600) return '🌧️';
    if (weatherId >= 600 && weatherId < 700) return '❄️';
    if (weatherId >= 700 && weatherId < 800) return '🌫️'; 
    if (weatherId === 800) return '☀️'; 
    if (weatherId > 800) return '☁️'; 
    return '🌤️'; // Default
}



document.querySelector('button').addEventListener('click', getWeather);


cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});



const lastCity = localStorage.getItem('lastWeatherCity');
if (lastCity) {
    cityInput.value = lastCity;
    getWeather();
} else {
   
    cityInput.value = 'London';
    getWeather();
}


const originalGetWeather = getWeather;
getWeather = async function() {
    const city = cityInput.value.trim();
    if (city) {
        localStorage.setItem('lastWeatherCity', city);
    }
    await originalGetWeather();
};

console.log('🌤️ Weather App Ready!');
console.log('📝 Get your free API key at: https://openweathermap.org/api');