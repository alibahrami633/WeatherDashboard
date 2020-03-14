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
    var lat = "";
    var lon = "";
    var queryURL2 = "";
    var results = $("#results");
    var div = $("<div>");
    div.addClass("border-top-bottom");


    $.ajax({
        url: queryURL1,
        method: "GET"
    }).then(function (response) {
        temprature = response.list[0].main.temp;
        humidity = response.list[0].main.humidity;
        windSpeed = response.list[0].wind.speed;
        lat = response.city.coord.lat;
        lon = response.city.coord.lon;

        div.append("<h4>" + "City: " + response.city.name + "</h4>");
        div.append("<p>" + "Temprature: " + temprature + "<span class='degree'> &#8451;</span>" + "</p>");
        div.append("<p>" + "Humidity: " + humidity + "</p>");
        div.append("<p>" + "Wind Speed: " + windSpeed + "</p>");

        queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?appid=4d5d0bdd780271b5d0440321f345fbb3&lat=" + lat + "&lon=" + lon;

        displayUV(queryURL2);

        results.html(div);
    });

    // retreives UV index
    function displayUV(queryURL2) {
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (response) {
            div.append("<p>" + "UV Index: " + response.value + "</p>");
        });
    }
}

