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
    var queryURL2 = ""; // uv index
    var results = $("#results");
    var fiveForecast = $("#fiveForecast");

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

        for (var i = 0; i < response.list.length; i += 8) {
            console.log(response.list[i]);
            var forecastResultDiv = $("<div>");
            forecastResultDiv.addClass("five-forecast");

            var date = "<p>" + response.list[i].dt_txt + "</p>";
            var temp = "<p>" + "Temprature: " + response.list[i].main.temp + "</p>";
            var humidity = "<p>" + "Humidity: " + response.list[i].main.humidity + "</p>";

            forecastResultDiv.html(date + temp + humidity);
            fiveForecast.append(forecastResultDiv);
        }

        // response.list.forEach(function (element) {
        //     console.log(element.dt);
        // });
        // console.log(response.list);
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

