import './css/style.css';
import Track from './TrackerClass';

import { Meal, Workout } from './ModuleClasses';


class App {
constructor () {
this._tracker = new Track();
this.showSavedItems();


let submit = document.querySelector('#inputs-form-meal');
submit.addEventListener('submit', this._addNewMeal.bind(this) );
let submitWorkout = document.querySelector('#form-workout');
submitWorkout.addEventListener('submit', this._addNewWorkouts.bind(this));

//To close modals
this.workoutModal = new bootstrap.Modal(document.getElementById('modal02'));
this.mealModal = new bootstrap.Modal(document.getElementById('modal01'));
this.limitModal = new bootstrap.Modal(document.getElementById('modal03'));
this.resetModal = new bootstrap.Modal(document.getElementById('modal04'));

//to show  cards 



let setButton = document.querySelector('#set-button');
setButton.addEventListener('click', this.setLimit.bind(this));
//document.addEventListener('DOMContentLoaded', this.setLimit.bind(this))

document.addEventListener('DOMContentLoaded', this._showMeals.bind(this) );

document.addEventListener('DOMContentLoaded', this._showWorkouts.bind(this));

document.addEventListener('click', this._deleteMeals.bind(this));

document.addEventListener('click', this._deleteWorkouts.bind(this));

document.addEventListener('DOMContentLoaded', this.showLimit.bind(this));

document.addEventListener('DOMContentLoaded', this.showSavedItems.bind(this));

document.addEventListener('keyup', this.filterMeals.bind(this));

document.addEventListener('keyup', this.filterWoukouts.bind(this));

let resetButton = document.querySelector('#reset-button');

resetButton.addEventListener('click', this.resetAll.bind(this));
}


_addNewMeal(e) {
   // e.preventDefault();
    if (!localStorage.getItem('MealsArr')) {
        localStorage.setItem('MealsArr', '[]');
    } else { 
        const arr = localStorage.getItem('MealsArr');
        const arr2 = JSON.parse(arr);
        let mealInput = document.querySelector('#meal-name');
        let calorieInput = document.querySelector('#calorie-number');

        if (mealInput.value === '' && calorieInput.value === '') {
           
         return   alert('Fill the input windows!');
           
          }
         else if (isNaN(Math.round(calorieInput.value)) )
          {
           
        return  alert('Calorie input should be a number')
            }

        else if (Math.round(calorieInput.value) < 0) {
           
         return   alert('Calorie input should be a positive number')
          
        }
         else if (Math.round(calorieInput.value) > 0) {
          
            const meal = new Meal(mealInput.value, Math.round(calorieInput.value));
            this._tracker.addMeal(meal);
            this._tracker._addMealCard(mealInput.value, Math.round(calorieInput.value), meal.id);
            arr2.push(meal);
            localStorage.setItem('MealsArr', JSON.stringify(arr2));
            mealInput.value = '';
            calorieInput.value = '';
            this.mealModal.hide();
        }
    }
    this.showLimit ();
    this.showSavedItems();
    this._tracker._render();
}


_addNewWorkouts(e) {
  //  e.preventDefault();
    let workoutInput = document.querySelector('#workout-input');
    let calorieWorkoutINput = document.querySelector('#burned-cals-input');

    if (!localStorage.getItem('WorkoutsArr')) {
        localStorage.setItem('WorkoutsArr', '[]');
    }
    else {
        const arr = localStorage.getItem('WorkoutsArr');
        const arr2 = JSON.parse(arr);
    const workout = new Workout(workoutInput.value, Math.round((calorieWorkoutINput.value)));

    if (workoutInput.value === '' || calorieWorkoutINput.value === '') {
    return   alert('Fill the input windows!');   
      }
     else if (isNaN(Math.round(calorieWorkoutINput.value)) )
      {
        return  alert('Calorie input should be a number')
        }
    else if (Math.round(calorieWorkoutINput.value) < 0) {
       
     return   alert('Calorie input should be a positive number')
    }
     else if (Math.round(calorieWorkoutINput.value) > 0) { 
   
    this._tracker.addWorkout(workout);
    this._tracker._addWorkoutCard(workoutInput.value, Math.round(calorieWorkoutINput.value), workout.id );
    arr2.push(workout);
    localStorage.setItem('WorkoutsArr', JSON.stringify(arr2));
    workoutInput.value = '';
    calorieWorkoutINput.value = '';
    this.workoutModal.hide();
     }
 
     this.showLimit ();
    this.showSavedItems();
    this._tracker._render();
     
    }}

_showMeals () {
    const meals = localStorage.getItem('MealsArr');
    const arr = JSON.parse(meals);
   
    arr.forEach(card => { 
        this._tracker._addMealCard(card.name, card.calories, card.id)
    })
   this.showLimit ();
   this.showSavedItems();
   this._tracker._render();
}

_showWorkouts () {

    const workouts = localStorage.getItem('WorkoutsArr');
    const arr = JSON.parse(workouts);
    arr.forEach(card => { 
        this._tracker._addWorkoutCard(card.name, card.calories, card.id)
    })
    this._tracker._render();
   
}

_deleteMealsFromLS(cardId) {
    const mealsFromLS = localStorage.getItem('MealsArr');
    const mealArr = JSON.parse(mealsFromLS);
    const updatedArrLS = mealArr.filter(item => item.id !== cardId);
    localStorage.setItem('MealsArr', JSON.stringify(updatedArrLS));
    this.showLimit ();
    this._tracker._render();

}

_deleteWorkoutsFromLS(cardId) {
    const workoutsFromLS = localStorage.getItem('WorkoutsArr');
    const workoutArr = JSON.parse(workoutsFromLS);
    const updatedArrLS = workoutArr.filter(item => item.id !== cardId);
    localStorage.setItem('WorkoutsArr', JSON.stringify(updatedArrLS));
}

_deleteMeals(e) {
 
    if (e.target.classList.contains('btn-close')) {
        const card = e.target.closest('div');
        const cardId = parseInt(card.getAttribute('id'));
        
        if (card.closest('#meal-wrapper')) {
            card.remove();
            this._deleteMealsFromLS(cardId);
            this._tracker.removeMeal(cardId);
            this._tracker._removeConsumedCals(cardId);
            this._tracker._gainCalories();
            this._tracker._setRange ();

             // Update total consumed calories in localStorage
             const totalConsumedCalories = this._tracker._meals.reduce((acc, item) => {
                return acc + item.calories;
            }, 0);
            localStorage.setItem('consumedCals', totalConsumedCalories);
        }
    }
    this._tracker._render();
    this.showLimit ();
    this.showSavedItems();
    this._tracker._render();
}


_deleteWorkouts(e) {
  
    if (e.target.classList.contains('btn-close')) {
        const card = e.target.closest('div');
        const cardId = parseInt(card.getAttribute('id'));
        
        if (card.closest('#workout-wrapper')) {
            card.remove();
            this._deleteWorkoutsFromLS(cardId);
            this._tracker.removeWorkout(cardId);
            this._tracker._removeBurnedCals(cardId);
            this._tracker._gainCalories();
            this._tracker._setRange ();
        }
    }
    this._tracker._render();
}

setLimit () {
    let limitDom = document.querySelector('#limit');
    let limitInput = document.querySelector('#limit-input');
    let limitLS = localStorage.getItem('limitInput');
   
     if (!limitInput.value) {
        // If the input is empty
        alert('Add number of calories!');
    } else if (isNaN(limitInput.value)) {
        // If the input is not a positive number
        alert('Input must be a number!');
    } else if (Number(limitInput.value) <= 0) {
        alert('Input must be a positive number!');
    }

  else  if(!limitLS) {
        this._tracker.setCalorieLimit(2000);
        this._tracker._calorieLimit = 2000;
    }
 else if (limitLS) { 
    this._tracker.setCalorieLimit(limitInput.value);
    this._tracker._calorieLimit = limitInput.value;

  
 }
 //limitDom.innerHTML = localStorage.getItem('limitInput');
 this.limitModal.hide();
    limitInput.value = '';
    this.showLimit ();
}

showLimit () {

    let limitLS = localStorage.getItem('limitInput');
    let limitDom = document.querySelector('#limit');

    if (limitLS) { 
    this._tracker.setCalorieLimit(limitLS);
    limitDom.innerHTML = limitLS;
 } else 
 {this._tracker._calorieLimit = 2000;
    this._tracker.setCalorieLimit(2000);
}
    this._tracker._render();
}

showSavedItems() {
    let mealsFromLS = localStorage.getItem('MealsArr');
    let consumedCals = localStorage.getItem('consumedCals');

    let burnedCaloriesLS = localStorage.getItem('burnedCals');
    let workoutsLS = localStorage.getItem('WorkoutsArr');
    

    if (!consumedCals) {
        if (this._tracker._meals.length > 0) {
            const mealArr = JSON.parse(mealsFromLS);
            consumedCals = mealArr.reduce((acc, item) => {
                return acc + item.calories;
            }, 0);
        } else {
            consumedCals = 0;
        }
        localStorage.setItem('consumedCals', consumedCals);
    }

    else if (!burnedCaloriesLS) {
        if (this._tracker._workouts.length > 0) {
            burnedCaloriesLS = workoutsLS.reduce((acc, item) => {
                return acc + item.calories;
            }, 0);
        } else {
            burnedCaloriesLS = 0;
        }
        localStorage.setItem('burnedCals', burnedCaloriesLS)
    }
    let consumedCalsDom = document.querySelector('#consumed-cals');
    consumedCalsDom.innerHTML = consumedCals;
    let burnedCalsDOM = document.querySelector('#burned-cals');
    burnedCalsDOM.innerHTML = burnedCaloriesLS;

 }

  filterMeals(e) {
    // Prevent the default form submission behavior (if this function is used as an event listener for a form)
   e.preventDefault();

    let filterInput = document.querySelector('#filter-input').value.trim().toLowerCase();

    // Get the meal container and convert its children into an array
    let mealContainer = document.querySelector('#meal-wrapper');
    const mealsSArrDOM = [...mealContainer.children];
    mealsSArrDOM.forEach(meal=>{
        let mealP = meal.querySelector('p');
        let mealText = mealP.innerHTML.trim().toLowerCase()
        if((mealText.includes(filterInput))) {
    meal.style.display = 'block';
    meal.classList.remove('d-none');
    meal.classList.add('d-flex');
   
        } else {
            meal.style.display = 'none';
            meal.classList.remove('d-flex');
            meal.classList.add('d-none');
        }
    }) 
}

filterMeals(e) {
    // Prevent the default form submission behavior (if this function is used as an event listener for a form)
   e.preventDefault();

    let filterInput = document.querySelector('#filter-input').value.trim().toLowerCase();

    // Get the meal container and convert its children into an array
    let mealContainer = document.querySelector('#meal-wrapper');
    const mealsSArrDOM = [...mealContainer.children];

    mealsSArrDOM.forEach(meal=>{
        let mealP = meal.querySelector('p');
        let mealText = mealP.innerHTML.trim().toLowerCase()
 
        if((mealText.includes(filterInput))) {
    meal.style.display = 'block';
    meal.classList.remove('d-none');
    meal.classList.add('d-flex');
   
        } else {
       
            meal.style.display = 'none';
            meal.classList.remove('d-flex');
            meal.classList.add('d-none');
        }
    }) 
}

filterWoukouts(e) {
    // Prevent the default form submission behavior (if this function is used as an event listener for a form)
   e.preventDefault();

    let filterInput = document.querySelector('#filter-workout-input').value.trim().toLowerCase();

    // Get the meal container and convert its children into an array
    let workoutContainer = document.querySelector('#workout-wrapper');
    const workoutsArrDOM = [...workoutContainer.children];

    workoutsArrDOM.forEach(workout=>{
        let workoutP = workout.querySelector('p');
        let workoutText = workoutP.innerHTML.trim().toLowerCase()

        if((workoutText.includes(filterInput))) {
    workout.style.display = 'block';
    workout.classList.remove('d-none');
    workout.classList.add('d-flex');
   
        } else {
     
            workout.style.display = 'none';
            workout.classList.remove('d-flex');
            workout.classList.add('d-none');
        }
    }) 
}

resetAll (e) {
    e.preventDefault();
  
const workoutWrapper = document.querySelector('#workout-wrapper');
const workoutArrDom = [...workoutWrapper.children];
let mealFilterInput = document.querySelector('#filter-input');
let workoutFilterInput = document.querySelector('#filter-workout-input');
workoutArrDom.forEach(workout =>{
workout.remove()
})

const mealWrapper = document.querySelector('#meal-wrapper');
const mealsArrDOM = [...mealWrapper.children]
mealsArrDOM.forEach(meal => {
meal.remove();
})

mealFilterInput.value = '';
workoutFilterInput.value = '';

this._tracker._totalCalorie = 0;
this._tracker._calorieLimit = 2000;
this._tracker._meals = [];
this._tracker._workouts = [];
localStorage.setItem('MealsArr', JSON.stringify([]));
localStorage.setItem('WorkoutsArr', JSON.stringify([]));
localStorage.setItem('limitInput', JSON.stringify(2000));
localStorage.setItem('burnedCals', JSON.stringify(0));
localStorage.setItem('consumedCals', JSON.stringify(0));
localStorage.setItem('totalCals', JSON.stringify(0));
this._tracker._addBurnedCals();
this._tracker._addConsumedCals();
this.resetModal.hide();
}

 }


   //borders on small screen

 let toggleButton = document.querySelector('.navbar-toggler-icon')
 toggleButton.addEventListener('click', hideBorder );
 window.addEventListener('DOMContentLoaded', displayBorder);
 window.addEventListener('resize', displayBorder );


 function hideBorder ()  {
    const liElements = document.querySelectorAll('.navbar-nav .nav-item');
            liElements.forEach(item => { item.classList.remove('border', 'border-md-1', 'border-light', 'rounded-2')
         })
        }
    
    
    function displayBorder () {
    const liElements = document.querySelectorAll('.navbar-nav .nav-item');
                liElements.forEach(item => {item.classList.add('border', 'border-md-1', 'border-light', 'rounded-2')
             })
        }
   
    
    

const app = new App();
