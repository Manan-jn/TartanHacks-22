
let socket = io()
var map;

let temp1= 12.9500725;
let temp2 = 77.7148746;
var latitudes= [];
var longitudes =[];
latitudes.push(temp1);
longitudes.push(temp2);

socket.on('shareLoc',(lati,longi)=>{
  // console.log(lati);
  // console.log(longi);
  // console.log(typeof(lati));
  // console.log(typeof(longi));
  temp1 = parseFloat(lati);
  temp2 = parseFloat(longi);
  // console.log(temp1);
  // console.log(typeof(temp1));


  latitudes.push(temp2);
  longitudes.push(temp1);
  setMarkers();
});

function setMarkers(){
  // for(var i=0;i<latitudes.length;i++){
  //   var myLatLng = { lat: latitudes[i] , lng: longitudes[i] };
  //   var mapOptions = {
  //     zoom: 10,
  //     center: myLatLng
  //   }
  //   console.log("hello");
  //   map = new google.maps.Map(document.getElementById("map"), mapOptions);
  //   new google.maps.Marker({
  //     position: myLatLng,
  //     map,
  //   });
  // };
  var myLatLng = { lat: latitudes[latitudes.length-1] , lng: longitudes[longitudes.length-1] };
  var mapOptions = {
    zoom: 10,
    center: myLatLng
  }
  console.log("hello");
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  new google.maps.Marker({
    position: myLatLng,
    map,
  });
}
console.log(temp1);
console.log(temp2);

function initMap() {
  // const myLatLng =  { lat: latitudes[latitudes.length-1] , lng: longitudes[longitudes.length-1] };

  // var mapOptions = {
  //   zoom: 10,
  //   center: myLatLng
  // }
  // map = new google.maps.Map(document.getElementById("map"), mapOptions);

  setMarkers();
  // new google.maps.Marker({
  //   position: myLatLng,
  //   map,
  // });
};


console.dir(socket);
