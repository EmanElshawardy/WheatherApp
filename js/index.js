var search = document.getElementById('search')

async function getData(city, latitude, longitude, flag) {
  if (!flag) {
    var apiResponse = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=155496e08cca41e9b30124535230508&q=${latitude},${longitude}&days=5`
    );

    if (apiResponse.ok && apiResponse.status) {
      var responseData = await apiResponse.json();
      displayTodayWeather(responseData.location, responseData.current, responseData.forecast.forecastday);
      displayAnotherDayWeather(responseData.forecast.forecastday);
    } else {
      console.log('Error fetching weather data:', apiResponse.status);
    }
  } else {
    var apiResponse = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=155496e08cca41e9b30124535230508&q=${city}&days=5`
    );

    if (apiResponse.ok && apiResponse.status) {
      var responseData = await apiResponse.json();
      displayTodayWeather(responseData.location, responseData.current, responseData.forecast.forecastday);
      displayAnotherDayWeather(responseData.forecast.forecastday);
    } 
    else {
      console.log('Error fetching weather data:', apiResponse.status);
    }
  }
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        getData(null, latitude, longitude,false); // Pass the coordinates to the getData function
      },
      function(error) {
        if (error.code === 1) {
          console.log('User denied Geolocation');
        } else {
          console.log('Error getting current location:', error);
        }
      }
    );
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
}
// Get weather data for the default location (Cairo)
getCurrentLocation();

search.addEventListener('keyup', function(event) {
  getData(event.target.value,null,null,true);
});



var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function displayTodayWeather(city,responseData,x) {
    var date = new Date(responseData.last_updated);
    let cartona = `
            <div class="col-md-4 ">
           <img src="https:${x[0].day.condition.icon}" width=150 alt="sun" class="img image-fluid " />
          </div>
          <div class="col-md-8">
            <div class="today  visible " style=" opacity: 1">
              <span>${days[date.getDay()]} ${date.getDate()} ${monthNames[date.getMonth()]}</span>
              <h1>${city.name} <img src="https:${responseData.condition.icon}" width=15% alt="TodayWeather" class="img image-fluid " /></h1>
              <p class="m-0">Temperature: ${responseData.temp_c}°C</p>
              <p>${responseData.condition.text}</p>
            </div>
          </div>`;
          document.getElementById("myData").innerHTML = cartona

}

function displayAnotherDayWeather(responseData){
var cartona = ``;
  for (let i = 1; i < responseData.length; i++) {
    cartona += `<div class="col-sm-3 col-lg-3">
    <div class="card weather-box justify-content-evenly align-items-center fw-bolder shadow rounded-5 ">
      <h1>${days[new Date(responseData[i].date).getDay()]}</h1>
      <img src="https:${ responseData[i].day.condition.icon}" width=100 class=" img-fluid " alt="sun" />
      <span class="temp">${responseData[i].day.maxtemp_c}°C</span>
    </div>
  </div>`;
  }
  document.getElementById("showAnotherDay").innerHTML = cartona;
}

