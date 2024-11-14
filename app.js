const apiKey = '36417e4de12644208a5164212242306';
const geoDBApiKey = 'c95b093f93msh30379131f06e071p1db943jsncc696ece55ae';

document.getElementById('city').addEventListener('input', () => {
    const city = document.getElementById('city').value;
    if (city.length > 2) {
        getCitySuggestions(city);
    } else {
        document.getElementById('suggestions').classList.remove('active');
    }
});

document.getElementById('searchBtn').addEventListener('click', () => {
    const city = document.getElementById('city').value;
    getWeather(city);
});


async function getCitySuggestions(query) {
    try {
        const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': geoDBApiKey,
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch city suggestions');
        const data = await response.json();
        displayCitySuggestions(data.data);
    } catch (error) {
        console.error(error.message);
    }
}


function displayCitySuggestions(cities) {
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';
    cities.forEach(city => {
        const div = document.createElement('div');
        div.textContent = `${city.city}, ${city.country}`;
        div.addEventListener('click', () => {
            document.getElementById('city').value = city.city;
            suggestions.classList.remove('active');
            getWeather(city.city);
        });
        suggestions.appendChild(div);
    });
    suggestions.classList.add('active');
}


async function getWeather(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        displayWeather(data);
        displayForecast(data.forecast.forecastday);
        changeBackgroundVideo(data.current.condition.text); 
        } catch (error) {
        alert(error.message);
    }
}


function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.classList.add('active');

    weatherInfo.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <div class="temp">${data.current.temp_c}°C</div>
        <div class="description">${data.current.condition.text}</div>
        <div class="details">
            <div>
                <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
                <p><strong>Pressure:</strong> ${data.current.pressure_mb} hPa</p>
            </div>
            <div>
                <p><strong>Wind Speed:</strong> ${data.current.wind_kph} kph</p>
                <p><strong>Wind Direction:</strong> ${data.current.wind_dir}</p>
            </div>
        </div>
    `;
}


function displayForecast(forecast) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    forecast.forEach(day => {
        const card = document.createElement('div');
        card.classList.add('forecast-card');
        card.innerHTML = `
            <h4>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</h4>
            <i class="fas fa-${getWeatherIcon(day.day.condition.text)} forecast-icon"></i>
            <div class="forecast-temp">${day.day.avgtemp_c}°C</div>
            <div class="forecast-desc">${day.day.condition.text}</div>
        `;
        forecastContainer.appendChild(card);
    });
}


function getWeatherIcon(condition) {
    if (condition.toLowerCase().includes("rain")) return "cloud-showers-heavy";
    if (condition.toLowerCase().includes("cloud")) return "cloud";
    if (condition.toLowerCase().includes("sun") || condition.toLowerCase().includes("clear")) return "sun";
    return "cloud-sun"; 
}

function changeBackgroundVideo(weatherCondition) {
    const video = document.getElementById('backgroundVideo');
    const videoSource = document.getElementById('videoSource');

    if (weatherCondition.toLowerCase().includes('rain')) {
        videoSource.src = 'rain_v.mp4';
    } else if (weatherCondition.toLowerCase().includes('cloud')) {
        videoSource.src = 'cloud.mp4';
    } else if (weatherCondition.toLowerCase().includes('sun') || weatherCondition.toLowerCase().includes('clear')) {
        videoSource.src = 'sunny.mp4.mp4';
    } else if (weatherCondition.toLowerCase().includes('mist')) {
        videoSource.src = 'mist.mp4'; 
    } else {
        videoSource.src = 'default.mp4';
    }

    video.load(); 
}