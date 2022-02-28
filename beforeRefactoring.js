'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

///////////////////////////////////////////

let map;
let mapEvent;

// get the current position
navigator.geolocation?.getCurrentPosition(
  function (position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(position);
    console.log(latitude, longitude);
    const curCoords = [latitude, longitude];

    console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`);
    // show the leafleat map
    map = L.map('map').setView(curCoords, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // marker on current position
    L.marker(curCoords).addTo(map).bindPopup('current position').openPopup();

    // marker on clicked position
    map.on('click', function (mapEve) {
      mapEvent = mapEve;
      form.classList.remove('hidden');
      inputDistance.focus();
    });
  },

  function () {
    alert(`can't get your current position`);
  }
);

form.addEventListener('submit', function (e) {
  e.preventDefault();
  inputCadence.value =
    inputDistance.value =
    inputDuration.value =
    inputElevation.value =
      '';
  console.log('form submitted');

  // display the marker
  const { lat } = mapEvent.latlng;
  const { lng } = mapEvent.latlng;
  console.log(mapEvent.latlng);
  console.log(lat, lng);

  const clickedCoords = [lat, lng];

  L.marker(clickedCoords)
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 300,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('running workout')
    .openPopup();
});

inputType.addEventListener('change', function () {
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
});
