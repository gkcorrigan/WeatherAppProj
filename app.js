document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "97841375e21fe67f384d6246b362ab20";
  const searchInput = document.getElementById("searchInput");
  const searchBttn = document.getElementById("searchBttn");
  const unitToggle = document.getElementById("tempSystemToggle");
  const weatherInfoDiv = document.getElementById("weatherInfo");
  const weatherImage = document.getElementById("weatherImage");
  const warmImage = document.getElementById("warmImage");
  const homeArea = document.getElementById("homeArea");

  window.removeArea = function (index) {
    selectedAreasList.removeSelectedArea(index);
    selectedAreasList.displaySelectedAreas(homeArea);
};

  //search for weather info by accessing API
  const searchWeather = () => {
      const location = searchInput.value;
      const measurementSys = unitToggle.value;
      const weatherInfoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${measurementSys}`;

      fetch(weatherInfoUrl)
          .then((response) => {
              if (!response.ok) {
                  throw new Error(`Error: ${response.status}`);
              }
              return response.json();
          })
          .then((data) => {
              const weatherHeader = document.createElement("h2");
              const weatherDescriptionPara = document.createElement("p");
              const weatherTempPara = document.createElement("p");

              weatherHeader.textContent = `${data.name}, ${data.sys.country}`;
              weatherDescriptionPara.textContent = data.weather[0].description;
              weatherTempPara.textContent = data.main.temp;

              // Clear previous search info
              while (weatherInfoDiv.firstChild) {
                  weatherInfoDiv.removeChild(weatherInfoDiv.firstChild);
              }

              // Append new weather info and display correct picture
              weatherInfoDiv.append(weatherHeader, weatherDescriptionPara, weatherTempPara);
              const temperature = +data.main.temp;
              if (measurementSys == "imperial"){
                if (temperature < 60){
                    weatherImage.style.display = "block";
                    warmImage.style.display = "none";
                } else {
                    weatherImage.style.display = "none";
                    warmImage.style.display = "block";

                }
              } else if (measurementSys == "metric"){
                if (temperature < 15){
                    weatherImage.style.display = "block";
                warmImage.style.display = "none";

                } else {
                    weatherImage.style.display = "none";
                    warmImage.style.display = "block";
                }
              }
          })
      .catch((err) => {
        console.error(err);
        // Clear previous weather info and image in case of an error
        while (weatherInfoDiv.firstChild) {
            weatherInfoDiv.removeChild(weatherInfoDiv.firstChild);
        }
        weatherInfoDiv.textContent = 'Error fetching weather data.';
        weatherImage.src = ""; 
    });
};
// action for the button
if (searchBttn) {
searchBttn.addEventListener("click", searchWeather);
} else {
console.error("Element with ID 'searchBttn' not found");
}


const homeAreaBttn = document.getElementById("homeAreaBttn");
const selectedAreasList = new SelectedAreas();
homeAreaBttn.addEventListener("click", () => {
    selectedAreasList.addSelectedArea({
        location: searchInput.value,
        country: "", 
        temperature: "",
        timestamp: new Date().toLocaleString(),
    });
    selectedAreasList.displaySelectedAreas(homeArea);
});

});

class SelectedAreas {
    constructor() {
        this.selectedAreas = [];
    }

    addSelectedArea(area) {
        this.selectedAreas.push(area);
      
    }
    removeSelectedArea(index) {
        this.selectedAreas.splice(index, 1);
        console.log(`Removing area at index ${index}`);
        
    }

    displaySelectedAreas(container) {
        container.innerHTML = '<h3>Saved Homes</h3>';

        this.selectedAreas.forEach((area, index) => {
            const areaDiv = document.createElement("div");
            areaDiv.innerHTML = `
                <p>${area.location}, ${area.country}</p>
                <p>Temperature: ${area.temperature}</p>
                <p>Last Update: ${area.timestamp}</p>
                <button class="remove-btn">Remove</button>
                <button class="refetch-btn">Refetch Weather</button>
            `;
            areaDiv.querySelector('.remove-btn').addEventListener('click', () => {
                this.removeSelectedArea(index);
                this.displaySelectedAreas(container);
            });
            container.appendChild(areaDiv);
        });
    }
}