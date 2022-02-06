let socket = io()
let map;

let lati;
let longi;
socket.on('shareLoc',(myLatitude, myLongitude)=>{
  console.log(myLatitude,myLongitude);
  lati = myLatitude;
  longi = myLongitude;
  alert("hello");
});

console.dir(socket);
function initMap() {
    const myLatLng =  { lat: lati, lng: longi };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: myLatLng,
    zoom: 10,
  });
  new google.maps.Marker({
    position: myLatLng,
    map,
  });
}