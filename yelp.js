var map = null;
var lat = 32.75;
var lng = -97.13;
var radius = 0.0;
var boundings = 0.0;
var center = 0.0;
var markers = [];
var swBounds = 0.0;
function initialize () {
map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center:{lat:32.75,lng:-97.13}
        });
		newBounds();
}

function sendRequest() {
   newBounds();
   deleteMarkers();
   var xhr = new XMLHttpRequest();
   var query = document.getElementById("search").value;
   console.log(query)
   console.log(lat,lng)
   xhr.open("GET", "proxy.php?term=" + query + "&latitude=" + lat + "&longitude=" + lng + "&radius="+ parseInt(radius) +"&sort_by=rating" + "&limit=10");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
		  var results = json["businesses"]
		  var str = "<div> <ol>"
		  for (var i=0; i < results.length; i++) {
			str += "<li>" + "<a href= \""+results[i].url+ " \" >" + results[i].name + "</a>" + "<br> <img height = \"200px\" width = \"200px\" src = \"" + results[i].image_url + "\"><br><h3>" + results[i].rating + "</h3></li>";
		  markers.push(new google.maps.Marker({position:{lat:results[i].coordinates.latitude, lng:results[i].coordinates.longitude}, map:map, label:(i+1).toString(), title:results[i].name}));
		}
		str += "</ol> </div>"
		document.getElementById("output").innerHTML =  str ;
       }
   };
   xhr.send(null);
}

function newBounds()
{
      google.maps.event.addListener(map, 'bounds_changed', function() {
      boundings =  this.getBounds()
      center = this.getCenter()
      swBounds = boundings.getSouthWest();
      radius = google.maps.geometry.spherical.computeDistanceBetween(swBounds, center);
	  lat = center.lat()
      lng = center.lng()
      
    })
}

function deleteMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
}
