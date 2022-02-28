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

// workout class (parent class)

class Workout {
  constructor(coords, distance, duration) {
    (this.coords = coords),
      (this.distance = distance),
      (this.duration = duration),
      (this.date = new Date());
    this.id = (Date.now() + '').slice(-5);
  }
}

const workout1 = new Workout(25, 23, 30);
// console.log(workout1);

// child classes

// running class

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.pace = this._calcPace();
  }

  // pace  min/km
  _calcPace() {
    return this.duration / this.distance;
  }
}

const running1 = new Running(23, 50, 3, 50);
// console.log(running1);

// cycling class
class Cycling extends Workout {
  constructor(coords, distance, duration, elevGain) {
    super(coords, distance, duration);
    this.elevGain = elevGain;
    this.speed = this._calcSpeed();
  }

  // speed km/hour
  _calcSpeed() {
    return this.distance / this.duration;
  }
}

const cycling1 = new Cycling(25, 20, 5, 15);
// console.log(cycling1);

////////////////////////////////////////////////////////
//////////////////////////////

let map;
let mapEvent;
let workouts = [];

class App {
  constructor() {
    this._CurrentPosition();
    this._showForm();
    this._toggleFormFields();
    this._showCliclkedWorkout();
    this._getLocalStorage();
  }

  // get the current position

  _CurrentPosition() {
    navigator.geolocation?.getCurrentPosition(this._ShowMap, function () {
      alert(`can't get your current position`);
    });
  }

  // show the map

  _ShowMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    // console.log(position);
    // console.log(latitude, longitude);
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
  }

  // show the form when clicks on the map
  _showForm() {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const { lat } = mapEvent.latlng;
      const { lng } = mapEvent.latlng;
      // console.log(mapEvent.latlng);
      // console.log(lat, lng);
      const clickedCoords = [lat, lng];

      // console.log('form submitted');

      // render new workout

      // show a popup on the map with the new workout values

      const workoutType = inputType.value;
      const distanceValue = +inputDistance.value;
      const durationValue = +inputDuration.value;
      let cadenceValue;
      let elevGainValue;
      let workout;
      console.log(distanceValue, durationValue, workoutType);

      // running workout

      if (workoutType === 'running') {
        cadenceValue = +inputCadence.value;

        // check if valid values

        if (
          !distanceValue ||
          distanceValue < 0 ||
          !durationValue ||
          durationValue < 0 ||
          !cadenceValue ||
          cadenceValue < 0
        ) {
          alert('all values should be filled with positive numbers');
        }

        workout = new Running(
          clickedCoords,
          distanceValue,
          durationValue,
          cadenceValue
        );
        workouts.push(workout);
      }

      // cycling workout

      if (workoutType === 'cycling') {
        elevGainValue = inputElevation.value;

        // check if valid values
        if (
          !Number.isFinite(distanceValue) ||
          distanceValue < 0 ||
          !durationValue ||
          durationValue < 0
        ) {
          alert('all values should be filled with positive numbers');
        }

        workout = new Cycling(
          clickedCoords,
          distanceValue,
          durationValue,
          elevGainValue
        );
        workouts.push(workout);
      }

      const workoutDescription = `${workoutType[0].toUpperCase()}${workoutType.slice(
        1
      )} on ${workout.date.getDate()} ${months[workout.date.getMonth()]}`;

      // render the workout list

      let html = ` 
        <li class="workout workout--${workoutType}" data-id="${workout.id}">
        <h2 class="workout__title">${workoutDescription}</h2>
        <div class="workout__details">
          <span class="workout__icon">${
            workoutType === 'running' ? '🏃‍♂️' : '🚴‍♀️'
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${durationValue}</span>
          <span class="workout__unit">min</span>
        </div>`;

      if (workoutType === 'running') {
        html += `
       <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.pace.toFixed(2)}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${cadenceValue}</span>
        <span class="workout__unit">spm</span>
      </div>
     </li> `;
      }

      if (workoutType === 'cycling') {
        html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(2)}</span>
          <span class="workout__unit">km/h</span>
       </div>
       <div 
         class="workout__details">
         <span class="workout__icon">⛰</span>
         <span class="workout__value">${elevGainValue}</span>
         <span class="workout__unit">m</span>
      </div>
     </li>`;
      }

      form.insertAdjacentHTML('afterend', html);

      app._setLocalStorage();

      // prettier-ignore
      inputCadence.value = inputDistance.value = inputDuration.value =  inputElevation.value = '';

      // hide the form again

      form.classList.add('hidden');

      // moved up before running and cycling

      // // display the marker
      // const { lat } = mapEvent.latlng;
      // const { lng } = mapEvent.latlng;
      // // console.log(mapEvent.latlng);
      // // console.log(lat, lng);

      // const clickedCoords = [lat, lng];

      L.marker(clickedCoords)
        .addTo(map)
        .bindPopup(
          L.popup({
            maxWidth: 300,
            autoClose: false,
            closeOnClick: false,
            className: `${workoutType}-popup`,
          })
        )
        .setPopupContent(`${workoutDescription}`)
        .openPopup();
    });
  }

  // toggle between the fields
  _toggleFormFields() {
    inputType.addEventListener('change', function () {
      inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
      inputElevation
        .closest('.form__row')
        .classList.toggle('form__row--hidden');
    });
  }

  // move to clicked workout

  _showCliclkedWorkout() {
    containerWorkouts.addEventListener('click', function (e) {
      const clickedEl = e.target.closest('.workout');
      if (!clickedEl) return;
      const workoutNeeded = workouts.find(el => el.id === clickedEl.dataset.id);
      console.log(workoutNeeded);
      console.log(clickedEl);
      map.setView(workoutNeeded.coords, 14, {
        animate: true,
        pan: {
          duration: 0.5,
        },
      });
    });
  }

  // the local storage functionality

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    console.log(data);

    if (!data) return;

    workouts = data;
  }

  // show the workout on the map
}

const app = new App();

//////////////////////////////////////////////
//////////////

// notes about refactoring

/*
all the code before refactoring is in beforeRefactoring.js file

we will use the oop to structure the code

it's very common to have all the code in one class like we will do here

we can add methods in the constructor if we need it to be called immediately
like the get current position method

remember when i want to convert to a number i can just add + before it
*/
