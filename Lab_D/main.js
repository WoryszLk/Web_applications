const apiKey = "7ded80d91f2b280ec979100cc8bbba94";
const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
var xhr;

let forecastCounter = 5;  // Licznik dni prognozy, zaczynamy od 5 dni

function getCurrentWeather() {
    const addressInput = document.getElementById("addressInput").value;

    // Get Current Weather
    xhr = new XMLHttpRequest();
    const currentWeatherRequest = new XMLHttpRequest();
    currentWeatherRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const currentWeatherData = JSON.parse(this.responseText);
            console.log("Current Weather Data:", currentWeatherData); // Dodaj to
            displayCurrentWeather(currentWeatherData);
        }
    };
    currentWeatherRequest.open("GET", `${currentWeatherUrl}?q=${addressInput}&appid=${apiKey}`, true);
    currentWeatherRequest.send();
}

function getForecast() {
    const addressInput = document.getElementById("addressInput").value;

    // 5 day forecats
    fetch(`${forecastUrl}?q=${addressInput}&appid=${apiKey}`)
    .then(response => response.json())
    .then(forecastData => {
        console.log("Forecast Data:", forecastData);
        displayNextDaysForecast(forecastData);
    });

}

function displayCurrentWeather(data) {
    const currentWeatherElement = document.getElementById("currentWeather");
    const weatherIcon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

    currentWeatherElement.innerHTML = `<h2>Current Weather in ${data.name}</h2>
                                        <p>Temperature: ${convertKelvinToCelsius(data.main.temp)} ℃</p>
                                        <p>Description: ${data.weather[0].description}</p>
                                        <img src="${iconUrl}" alt="Weather Icon">`;
}

function displayNextDaysForecast(data) {
    const forecastElement = document.getElementById("forecast");
    forecastElement.innerHTML = "";  // Wyczyszczenie poprzednich danych

    const forecastHeaderElement = document.getElementById("forecastHeader");
    forecastHeaderElement.innerHTML = `<h2>Forecast for Next ${forecastCounter} Days</h2>`;

    const forecastContainer = document.createElement("div");
    forecastContainer.classList.add("forecast-container");

    for (let i = 0; i < forecastCounter; i++) {
        const dataIndex = i * 8;

        if (data.list[dataIndex]) {
            const forecastDate = new Date(data.list[dataIndex].dt * 1000);
            const dayOfWeek = getDayOfWeek(forecastDate.getDay());
            const temperature = convertKelvinToCelsius(data.list[dataIndex].main.temp);
            const weatherIcon = data.list[dataIndex].weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

            const forecastDay = document.createElement("div");
            forecastDay.classList.add("forecast-day");
            forecastDay.innerHTML = `<p>${dayOfWeek} ${forecastDate.toDateString()} - ${temperature} ℃ 
                                    <img src="${iconUrl}" alt="Weather Icon"></p>`;
            forecastContainer.appendChild(forecastDay);
        } else {
            const emptyDay = document.createElement("div");
            emptyDay.classList.add("forecast-day");
            emptyDay.innerHTML = `<p>Data not available for day ${i + 1}</p>`;
            forecastContainer.appendChild(emptyDay);
        }
    }

    forecastElement.appendChild(forecastContainer);

    // Zwiększ licznik dni prognozy
    forecastCounter += 5;
}



function resetForecastCounter() {
    // Zresetuj licznik dni prognozy po każdym pobraniu prognozy
    forecastCounter = 5;
}



function getDayOfWeek(day) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek[day];
}

// Konwersja na celsjusze 
function convertKelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(2);
}
