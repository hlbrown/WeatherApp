// api https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon=//{lon}&exclude={part}&appid={API key}

//api key "e818af6194a203b3404ae3dd0228f763"
var userInputEl = document.getElementById("user-input");
var inputFormEl = document.getElementById("input-form");
var showingResultsDiv = document.getElementById("showing-results");
var citiesDiv = document.getElementById("cities");

var myKey = "e818af6194a203b3404ae3dd0228f763";

var userFormHandler = function(event){
    event.preventDefault();

    var userInput = userInputEl.value.trim();
    //setting up the local storage 
    if(localStorage.getItem("searchHistory") == null){
        localStorage.setItem("searchHistory", "[]");
    }

    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    searchHistory.unshift(userInput);
    //retaining the user input history
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    userInputEl.value = "";
    renderHistory();
    weatherApi(userInput);
};

//shows the searched cities
var renderHistory = function () {
   var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
   citiesDiv.innerHTML = "";
   for(var i = 0; i < searchHistory.length && i < 8; i++){
       if(searchHistory[i] !== ""){
           citiesDiv.innerHTML += `<button data-city='${searchHistory}'
           class="btn btn-secondary bg-gradient w-100 my-1"
           type="button">${searchHistory[i]}</button>`;
       }
   }
};

//getting the weather information from the openweather forecast api
var weatherApi = function(userInput){
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" +
    userInput +
    "&units=imperial&appid=" +
    myKey;//uses the api key here and displays temp in ℉
    fetch(requestUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            renderJumbotron(data);
        });
};

var renderJumbotron = function(data){//function to render the current weather info
    showingResultsDiv.innerHTML =` <div class="jumbotron p-3 m-2 bg-light rounded text-black"><h3><b>${data.city.name}</b>(${moment.unix(data.list[0].dt).format("MM/DD/YYYY")})</h3>
    <p class="lead">Temp: ${data.list[0].main.temp} ℉;<br></p>
    <p>wind: ${data.list[0].wind.speed} MPH<br></p>
    <p>Humidity: ${data.list[0].main.humidity} %<br></p>
    <p>UV Index: <span id="uvIndexEl"</span></p>
    </div>
    <div class="container-fluid ">
    <h1 class="text-black center row-2 ms-3 bg-light justify-content-around rounded">5-day Forecast</h1>
   
    <div id="fiveDay" class='row d-flex justify-content-around p-3'></div>
    </div>`;
    renderUvIndex(data.city.coord.lat, data.city.coord.lon);
    renderFiveDay(data);
    document.body.style.backgroundColor = `grey`;
};
//function to output the next 5 days

var renderFiveDay = function(data) {
    var weather = [1, 6, 14, 22, 30];
    for (var i = 0; i < weather.length; i++){
        var icon = `https://openweathermap.org/img/w/${
            data.list[weather[i]].weather[0].icon
          }.png`;
          document.getElementById("fiveDay").innerHTML += `
          <div class ="card col-lg-2 col-md-6 bg-$blue-100 text-black" >
          <div class="card-body">
            <h5 class="card-title">${moment.unix(data.list[weather[i]].dt).format("MM/DD/YYYY")}</h5><br>
            <img src='${icon}'/>
            <p class="lead">Temp: ${data.list[weather[i]].main.temp}℉;<br></p>
            <p>Wind: ${data.list[weather[i]].wind.speed} MPH<br></p>
            <p>Humidity: ${data.list[weather[i]].main.humidity} %<br></p>
          </div>
          </div>`;
    }
};

//getting the users lat long using the onecall api 
var renderUvIndex = function(lat, lon){
    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${myKey}`;

    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        var uvIndex = data.current.uvi;
        document.getElementById("uvIndexEl").innerHTML = uvIndex < 3//coloring the button based on the uv index for that day
        ?`<button type="button" class="btn btn-success bg-gradient"${uvIndex}</button>`
        : uvIndex < 6
        ?`<button type="button" class="btn btn-warning bg-gradient>${uvIndex}</button>`
        : `<button type="button" class="btn btn-danger bg-gradient">${uvIndex}</button`;
    });
};

var buttonClickHandler = function(event){
    var city = event.target.getAttribute("data-city");
    if(city){
        weatherApi(city);
    }
};

citiesDiv.addEventListener("click", buttonClickHandler);
inputFormEl.addEventListener("submit", userFormHandler);