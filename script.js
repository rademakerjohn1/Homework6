$(document).ready(function() {

  // Gets array from local storage, creates empty array if no local storage
  var history = JSON.parse(window.localStorage.getItem("history")) || [] ;
  
  // Displays weather for most recent city search
  searchWeather(history[history.length -1]);
  
  // Makes list of local storage if available
  if (history.length > 0) {;
    for (var j = 0; j < history.length; j++) {
      makeRow(history[j]);;
    }
  }

  // Makes list item using input value from searchWeather, prepends item to history list, displays clear button
  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(li).prependTo(".history");
    $("#clear-button").css("display", "inline-block");
    $("#search-header").css("display", "inline-block");
  }

  // Stores form input on click, clears form and runs searchWeather with stored value
  $("#search-button").on("click", function() {
    var searchValue = $("#search-value").val();
    $("#search-value").val("");
    searchWeather(searchValue);
  });

  // Runs searchWeather using history item value 
  $(".history").on("click", "li", function() {
    searchWeather($(this).text());
  });
  
  // Empties history list, clears local storage and hides clear button  
  $("#clear-button").on("click", function() {
      $(".history").empty();
      $("#clear-button").css("display", "none");
      $("#search-header").css("display", "none");
      localStorage.clear();
      $(historyPara).empty();
  });
  

  // Retrieves and displays weather info from API, adds value to history array, stores updated history in local storage
  function searchWeather(searchValue) {
    
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=207fdcef3a4a2e45e26c8636366d527f",
      dataType: "json",
      success: function(data) {
        
        if (history.indexOf(searchValue) === -1) {
          history.push(searchValue);
          window.localStorage.setItem("history", JSON.stringify(history));
          makeRow(searchValue);
        }

        $("#today").empty();
        
        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");
        var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + ((data.main.temp - 273.15) * 1.80 + 32).toFixed(2) + " °F");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");

        title.append(img);
        cardBody.append(temp, humid, wind);
        card.append(title, cardBody);
        $("#today").append(card);

        getForecast(searchValue);
        // getUVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }

  // Retrives and displays 5-day noon-time forecast info 
  function getForecast(searchValue) {
    
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=207fdcef3a4a2e45e26c8636366d527f",
      dataType: "json",
      success: function(data) {

        $("#forecast").empty();
        $("#forecast-header").empty();
        $("#forecast-header").append($("<h3>").text("5-Day Forecast"));

        for (var i = 0; i < data.list.length; i++) {

          if (data.list[i].dt_txt.indexOf("12:00:00") !== -1) {
            
            // Formats date
            var forecastDateArray = data.list[i].dt_txt.split(" ");
            forecastDateSubArray = (forecastDateArray[0].split("-"));
            var forecastDate = $("<h6>").addClass("card-title").text(forecastDateSubArray[1] + "/" + forecastDateSubArray[2] + "/" + forecastDateSubArray[0]);
            
            var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
            var forecastTemp = $("<p>").addClass("card-text").text("Temp: " + ((data.list[i].main.temp - 273.15) * 1.80 + 32).toFixed(2) + " °F"); 
            var forecastHumidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
            var forecastWind = $("<p>").addClass("card-text").text("Wind: " + data.list[i].wind.speed + " MPH");
            var cardBody = $("<div>").addClass("card-body");
            var card = $("<div>").addClass("card");
            
            $(card).append(forecastDate, cardBody);
            $(cardBody).append(img, forecastTemp, forecastHumidity, forecastWind);
            $("#forecast").append(card);
          }
        }
      }
    })
  }
});



