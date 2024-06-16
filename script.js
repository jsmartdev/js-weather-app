// get weather function

const clearDiv = (div) => {
  while(div.firstChild) {
    div.removeChild(div.firstChild)
  }
}

const showImage = () => {
  const weatherIcon = document.getElementById('weather-icon');
  weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}

const displayWeather = (data) => {

  const tempDiv = document.getElementById('temp-div');
  const weatherInfoDiv = document.getElementById('weather-info');
  const weatherIcon = document.getElementById('weather-icon');
  const hourlyForecastDiv = document.getElementById('hourly-forecast');
  
  clearDiv(weatherInfoDiv);
  clearDiv(hourlyForecastDiv);
  clearDiv(tempDiv);

  if (data.cod === '404') {
    const paragraph = document.createElement('p');
    paragraph.textContent = data.message;
    weatherInfoDiv.appendChild(paragraph);
  } else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const tempParagraph =  document.createElement('p');
    const cityParagraph = document.createElement('p');
    const descriptionParagraph = document.createElement('p');
    tempParagraph.textContent = `${temperature}°C`;
    cityParagraph.textContent = `${cityName}`;
    descriptionParagraph.textContent = `${description}`
    
    tempDiv.appendChild(tempParagraph);
    weatherInfoDiv.appendChild(cityParagraph);
    weatherInfoDiv.appendChild(descriptionParagraph);
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    showImage();
  }

}

const displayHourlyForecast = (hourlyData) => {
  
  const hourlyForecastDiv = document.getElementById('hourly-forecast');

  const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

  next24Hours.forEach(item => {
    const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourDiv = document.createElement('div');
    const hourSpan = document.createElement('span');
    const tempSpan = document.createElement('span');
    const hourIcon = document.createElement('img');

    hourSpan.textContent = `${hour}:00`;
    tempSpan.textContent = `${temperature} °C`

    hourIcon.src = iconUrl;
    hourIcon.alt = 'Hourly Weather Icon';

    hourDiv.classList.add('hourly-item');
    hourDiv.appendChild(hourSpan);
    hourDiv.appendChild(hourIcon);
    hourDiv.appendChild(tempSpan);
    hourlyForecastDiv.appendChild(hourDiv);
  });

}

const getWeather = () => {

  const apiKey = 'a69ebdcc3b0217984aeb686560243ca2';
  const city = document.getElementById('city-input');
  const cityValue = city.value;
  
  if(!cityValue) {
    alert('Please enter a city!');
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}`;

  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
    })
    .catch(err => {
      console.error('Error fetching current weather data:', err)
      alert('Error fetching current weather data! Please try again!')
    });

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      displayHourlyForecast(data.list);
    })
    .catch(error => {
      console.error('Error fetching hourly forecast data:', error);
      alert('Error fetching hourly forecast data. Please try again.');
    });

}






