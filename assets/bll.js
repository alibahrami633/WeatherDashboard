var citiesList = [];
var historyList = $("#history-list");
var cityName = "";

localStorageInit();

$("#search-button").on("click", displayCurrentWeather);

function displayCurrentWeather() {
    event.preventDefault();

    // checks if the search button or a history button is clicked
    var historyCity = $(this).attr("data-cityName");

    if (historyCity) {
        cityName = historyCity;
    }
    else {
        cityName = capitalizeFirstLetter($.trim($("#cityName").val()));
    }

    // city input text validation - no empty input clicked
    if (cityName !== "") {
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
        var iconURL = "";

        var div = $("<div>");
        div.addClass("border-top-bottom col-md-12");

        localStorageInit();

        // current weather
        $.ajax({
            url: queryURL1,
            method: "GET"
        }).then(function (response) {

            // checks if the city exist in the array, it will move the city to the first index of the array otherwise will push it
            if (citiesList.includes(cityName) === false && cityName !== "") {
                if (response) citiesList.push(cityName);
            }
            else {
                // moves the cityName to the first index if already exist in the array
                citiesList.sort(function (x, y) { return x == cityName ? -1 : y == cityName ? 1 : 0; });
            }

            localStorage.setItem("citiesList", citiesList);

            iconURL = "http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + "@2x.png";
            temprature = response.list[0].main.temp;
            humidity = response.list[0].main.humidity;
            windSpeed = response.list[0].wind.speed;
            lat = response.city.coord.lat;
            lon = response.city.coord.lon;

            div.append("<h4>" + response.city.name + " (" + currentDate + ")" + "<img src='" + iconURL + "'></h4>");
            div.append("<p>" + "Temprature: " + temprature + "<span class='degree'> &#8451;</span>" + "</p>");
            div.append("<p>" + "Humidity: " + humidity + "<span class='degree'>%</span></p>");
            div.append("<p>" + "Wind Speed: " + windSpeed + " <span class='degree'>KPH</p>");

            queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?appid=4d5d0bdd780271b5d0440321f345fbb3&lat=" + lat + "&lon=" + lon;

            displayUV(queryURL2, div);

            results.html(div);

            // Five day forecast
            fiveForecast.empty();
            for (var i = 0; i < response.list.length; i += 8) {
                var forecastResultDiv = $("<div>");
                forecastResultDiv.addClass("five-forecast");
                var forecastIcon = "<img src='http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png'>";
                var date = "<p>" + (response.list[i].dt_txt).slice(0, 10) + "</p>"; // slice chooses the date part of the string 0-10
                var temp = "<p>" + "Temprature: " + response.list[i].main.temp + "<span class='degree'> &#8451;</span></p>";
                var humidity = "<p>" + "Humidity: " + response.list[i].main.humidity + "<span class='degree'>%</span></p>";

                forecastResultDiv.html(date + forecastIcon + temp + humidity);

                fiveForecast.append(forecastResultDiv);
            }
            cityName = "";
        }).catch(function (error) {
            console.log(error);
        });
    }
}

// retreives UV index
function displayUV(queryURL2, div) {
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function (response) {
        div.append("<p>UV Index: <span class='uvColor'>" + response.value + "</span></p>");
        if (parseInt(response.value >= 0 && response.value <= 2)) {
            $(".uvColor").css("background-color", "green");
        }
        else if (parseInt(response.value >= 3 && response.value <= 5)) {
            $(".uvColor").css("background-color", "yellow");
        }
        else if (parseInt(response.value >= 6 && response.value <= 7)) {
            $(".uvColor").css("background-color", "orange");
        }
        else {
            $(".uvColor").css("background-color", "red");
        }
    });
}

// capitalizes the first letter of a string
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()
}

function localStorageInit() {
    // history list initiation
    if (localStorage.getItem("citiesList")) {
        citiesList = localStorage.getItem("citiesList").split(",");
    }

    // adding search history
    historyList.empty();
    for (var i = 0; i < citiesList.length; i++) {
        var li = $("<li>");
        li.addClass("list-group-item city-button");
        li.attr("data-cityName", citiesList[i]);
        li.text(citiesList[i]);

        historyList.append(li);
    }
}

$(document).on("click", ".city-button", displayCurrentWeather);