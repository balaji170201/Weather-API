async function getCountries() {
    try {
      const response = await fetch('https://restcountries.com/v2/all');
      const data = await response.json();
      console.log(data);
      const row = document.getElementById('row');
      row.innerHTML = ''; // Clear the row before adding new cards
  
      // Use forEach with async/await
      await Promise.all(data.map(async (country) => {
        const { name, capital, region, cioc, flags, nativeName, population, latlng } = country;
        const latitude = latlng && latlng.length >= 2 ? latlng[0] : 'N/A';
        const longitude = latlng && latlng.length >= 2 ? latlng[1] : 'N/A';
  
        // Create a card for each country
        const card = document.createElement('div');
        card.classList.add('col-sm-12', 'col-md-6', 'col-lg-4'); // Adjust column classes
        card.innerHTML = `
          <div class="card text-center">
            <p class="card-header">${name}</p>
            <div class="card-body">
              <img src="${flags.png}" class="card-img-top" alt="${name} flag">
              <p class="card-text">Capital : ${capital}</p> 
              <p class="card-text">Region : ${region}</p>
              <p class="card-text">Country Code : ${cioc}</p>
              <p class="card-text">Native Name : ${nativeName}</p>
              <p class="card-text">Population: ${population}</p>
              <button class="btn btn-primary get-weather-button">Get Weather</button>
            </div>
          </div>
        `;
  
        // Append the card to the 'row' element
        row.appendChild(card);
  
        // Update the event listener for the "Get Weather" button to pass the country name
        const getWeatherButton = card.querySelector('.get-weather-button');
        getWeatherButton.addEventListener('click', async () => {
          await getWeather(latitude, longitude, name);
        });
      }));
    } catch (error) {
      console.error('An error occurred while fetching and processing data:', error);
    }
  }
  
  // Update the getWeather function to display weather in the modal using .innerHTML
async function getWeather(latitude, longitude, countryName) {
    if (latitude !== 'N/A' && longitude !== 'N/A') {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=7ec61bd8dfa9e228cd576ac80f210d84`);
        const data = await response.json();
        let pressure = data.main.pressure;
        let humidity = data.main.humidity;
        let temp = data.main.temp;
  
        // Create a string with weather information
        const weatherInfo = `Temperature : ${temp}, Pressure : ${pressure}, Humidity: ${humidity}`;
  
        // Create the modal content using .innerHTML
        const modalContent = `
          <div class="modal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">${countryName} Weather Information</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <p>${weatherInfo}</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        `;
  
        // Set the modal content using .innerHTML
        document.getElementById('weatherModalPlaceholder').innerHTML = modalContent;
  
        // Show the modal
        const weatherModal = document.querySelector('.modal');
        const modal = new bootstrap.Modal(weatherModal);
        modal.show();
      } catch (error) {
        console.error('An error occurred while fetching weather data:', error);
      }
    } else {
      console.error('Latitude and longitude data is missing or incomplete.');
    }
}
getCountries();
  