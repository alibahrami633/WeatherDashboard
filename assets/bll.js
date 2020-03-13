$("#search-button").on("click", displayCurrentWeather);

function displayCurrentWeather() {
    event.preventDefault();

    var cityName = $.trim($("#cityName").val());
    // console.log(cityName);
    var queryURL1 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + ",VIC,AU&units=metric&appid=4d5d0bdd780271b5d0440321f345fbb3";
    var currentDate = moment().format("DD-MMM-YYYY");
    var temprature = "";
    var humidity = "";
    var windSpeed = "";
    var uvIndex = "";
    var lat = "";
    var lon = "";
    var queryURL2 = "";
    

    $.ajax({
        url: queryURL1,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        
        temprature = response.list[0].main.temp;
        humidity = response.list[0].main.humidity;
        windSpeed = response.list[0].wind.speed;
        lat = response.city.coord.lat;
        lon = response.city.coord.lon;

        queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?appid=4d5d0bdd780271b5d0440321f345fbb3&lat=" + lat + "&lon=" + lon;

        uvIndex = displayUV(queryURL2);
    });    
}

function displayUV(queryURL2) {
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response) {
        console.log(response);        
        return response.value;
    });
}