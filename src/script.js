window.addEventListener("DOMContentLoaded", () => {
    const apiKey = '8ae2ac2da457bcd3e83c28c293b5e3dd'; // Replace with your OpenWeatherMap API key
    const weatherInfo = document.getElementById('weather-info');
    const forecast = document.getElementById('forecast');
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');

    // Function to fetch weather data by city
    async function getWeatherByCity(city) {
    try {
        const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        
        if (response.ok) {
        displayWeather(data);
        getForecastByCity(city);
        } else {
        weatherInfo.innerHTML = `<p class="text-red-500">City not found!</p>`;
        }
    } catch (error) {
        weatherInfo.innerHTML = `<p class="text-red-500">Error fetching weather data.</p>`;
    }
    }

    // Function to fetch 5-day forecast
    async function getForecastByCity(city) {
    try {
        const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        
        displayForecast(data);
    } catch (error) {
        forecast.innerHTML = `<p class="text-red-500">Error fetching forecast.</p>`;
    }
    }

    // Event listener for search button
    searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
        saveToLocalStorage(city); // Save searched city
    } else {
        weatherInfo.innerHTML = `<p class="text-red-500">Please enter a city name.</p>`;
    }
    });

    // Display current weather data
    function displayWeather(data) {
    const { name, main, weather, wind } = data;
    weatherInfo.innerHTML = `
        <div class="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg text-gray-900">
        <h2 class="text-3xl font-bold">${name}</h2>
        <p class="text-lg">${weather[0].description}</p>
        <p class="text-2xl font-bold">Temperature: ${main.temp}°C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
        </div>
    `;
    }

    // Display extended forecast as cards
    function displayForecast(data) {
    forecast.innerHTML = ''; // Clear previous forecast

    data.list.forEach((item, index) => {
        if (index % 8 === 0) {
        const date = new Date(item.dt_txt).toLocaleDateString();
        const cardHTML = `
            <div class="bg-white bg-opacity-80 p-4 rounded-lg shadow-lg text-gray-900 text-center">
            <h3 class="font-bold text-lg">${new Date(item.dt_txt).toLocaleString('en-US', { weekday: 'long' })}</h3>
            <p class="text-sm">${date}</p>
            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="weather-icon" class="mx-auto">
            <p class="text-xl font-bold">${item.main.temp}°C</p>
            <p>Wind: ${item.wind.speed} m/s</p>
            <p>Humidity: ${item.main.humidity}%</p>
            </div>
        `;
        forecast.innerHTML += cardHTML;
        }
    });
    }

    // Save to local storage for recently searched cities
    function saveToLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(cities));
        updateRecentCitiesDropdown();
    }
    }

    // Load recent cities from local storage
    function updateRecentCitiesDropdown() {
    const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (cities.length > 0) {
        let dropdownHTML = '<select id="recent-cities" class="border p-2 rounded-lg">';
        dropdownHTML += '<option>Select a city</option>';
        cities.forEach((city) => {
        dropdownHTML += `<option>${city}</option>`;
        });
        dropdownHTML += '</select>';
        weatherInfo.insertAdjacentHTML('beforeend', dropdownHTML);

        document.getElementById('recent-cities').addEventListener('change', (e) => {
        if (e.target.value !== 'Select a city') {
            getWeatherByCity(e.target.value);
        }
        });
    }
    }

    // Load cities on page load
    window.onload = updateRecentCitiesDropdown;

})


