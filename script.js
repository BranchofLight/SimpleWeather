console.log("Hello World!");

$(document).ready(function () {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            loadWeather(position.coords.latitude + ',' + position.coords.longitude);
        });
    } else {
        $('#weather p').remove();
        $('#weather').append("<p id=\"geolocation-status\">Your Location Could Not Be Determined</p>");
        $('#weather').append("<button id=\"locationButton\">Find Your Location</button>");
    }
  
  //loadWeather('Renfrew, ON', '');
  
  $('#locationButton').on('click', function() {    
    if ("geolocation" in navigator) {
          $('#weather *').remove();
          navigator.geolocation.getCurrentPosition(function (position) {
              loadWeather(position.coords.latitude + ',' + position.coords.longitude);
          });
    } else {
          $('#weather p').remove();
          $('#weather').append("<p id=\"geolocation-status\">Your Location Could Not Be Determined</p>");
          $('#weather').append("<button id=\"locationButton\">Find Your Location</button>");
    }
  });  

  $(window).resize(addTopBorder);

    /* test */
    /*$('#weather').after("<p id=\"geolocation-status\">Your Location Could Not Be Determined</p>");
	$('#weather').replaceWith("<button id=\"location\">Find Your Location</button>");*/
});

function loadWeather(location, woeid) {
    var weatherCodes = [
        ":", "p", "S", "Q", "S", "W", "W", "W", "W", "I",
        "W", "I", "I", "I", "I", "W", "I", "W", "U", "Z",
        "Z", "Z", "Z", "Z", "E", "E", "3", "a", "A", "a",
        "A", "6", "1", "6", "1", "W", "1", "S", "S", "S",
        "M", "W", "I", "W", "a", "S", "U", "S"];

    $.simpleWeather({
        location: location,
        woeid: woeid,
        unit: 'c',
        success: function (weather) {
            // display weather
            $('#weather p').remove();
            $('title').html(weather.title);
            var html = "";
          
            html += "<div class=\"row header\">";
            html += "<p>Current Weather</p>";
            html += "<p id=\"updateTime\">Last Updated: " + weather.updated.substring(weather.updated.length-12) + "</p>";
            html += "</div>";
          
            html += "<div class=\"row weatherPanel\">";
            html += "<p class=\"weatherIcon col-md-6\">" + weatherCodes[weather.code] + "</p>";         
            html += "<div class=\"col-md-6  weatherMain\">";
            html += "<p id=\"location\">" + weather.city + ", " + weather.region + "</p>";
            html += "<p>" + weather.currently + "</p>";            
            html += "<p><span class=\"degrees\">" + weather.temp + " " + weather.units.temp + "</span></p>";            
            setBackground(weather.temp);
            html += "<p><span class=\"humidity\">" + weather.humidity + "%</span></p>";
            if (weather.wind.chill !== weather.temp) {
              html += "<p><span class=\"degrees\">" + weather.wind.chill + " " + weather.units.temp + "</span></p>";
            }
            // Certain locations would give strange heat indices (eg. 22C with heat index of 79C)
            /*if (weather.heatindex !== weather.temp) {
              // Convert to celcius
              var heat = (weather.heatindex - 32) * 5/9;
              html += "<p><span class=\"degrees\">" + heat.toFixed(0) + " " + weather.units.temp + "</span></p>";
            }*/
            
            
            html += "</div>";
            html += "</div>";            
            $('#weather').append(html);
            // Set weatherMain to the height of weatherPanel 
            $('.weatherMain').css('height', $('.weatherPanel').css('height'));
            // Call in case browser is already within limits
            addTopBorder();
        },
        error: function (error) {
            $('#weather p').remove();
            $('#weather').append("<p id=\"geolocation-status\">Your Location Could Not Be Determined</p>");
            $('#weather').append("<button id=\"locationButton\">Find Your Location</button>");
        }
    });
};

function setBackground(temp) {
  var $out = $('.outer');
  if (temp < 5) {
    $out.css('background', "#0663C1");
  } else if (temp >= 5 && temp < 15) {
    $out.css('background', "#3E99F4");
  } else if (temp >= 15 && temp < 20){
    $out.css('background', "#6BCCDB");
  } else if (temp >= 20 && temp < 26) {
    $out.css('background', "#E6BA3D");
  } else if (temp >= 26) {
    $out.css('background', "#DE2D2B");
  }
};

var addTopBorder = function() {    
  // 992 is when the formatting changes - Bootstrap standard
  if ($(window).width() < 992) {
    $('.weatherMain').css('border-top', "2px solid black");
  } else {
    $('.weatherMain').css('border-top', "");
  }
};