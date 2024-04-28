
class Track {                   // tracker where to count calories and other stuff
    constructor() {
            //this value is updating based on adding and removing workout and meals
    this._workouts = JSON.parse(localStorage.getItem('WorkoutsArr')) || [];
    this._meals = JSON.parse(localStorage.getItem('MealsArr')) || [];
    this._totalCalorie = parseInt(localStorage.getItem('totalCals')) || 0;
    this._calorieLimit = parseInt(localStorage.getItem('limitInput')) || 2000;
    this._saveToLS ();
    }
    
    //set calorie limit 
    setCalorieLimit(limit) {
      
        this._calorieLimit = limit;
        localStorage.setItem('limitInput', limit);
    }
    
    
    //Public functions
    addMeal (meal) {           //function
    this._meals.push(meal); 
    this._totalCalorie += meal.calories;
    this._render();
    this._saveToLS ();
    localStorage.setItem('totalCals', this._totalCalorie);
        }
    
        removeMeal(cardID) {
            // Find the meal with the given cardID
            const mealToRemove = this._meals.find(item => item.id === +cardID);
        
            if (mealToRemove) {
                // Subtract the calories of the meal to be removed from _totalCalorie
                this._totalCalorie -= mealToRemove.calories;
        
                // Remove the meal from _meals array
                this._meals = this._meals.filter(item => item.id !== +cardID);
        
                // Render and save changes
                this._render();
                this._saveToLS();
                localStorage.setItem('totalCals', this._totalCalorie);
            }
        }
        
        removeWorkout(cardID) {
            // Find the workout with the given cardID
            const workoutToRemove = this._workouts.find(item => item.id === +cardID);
        
            if (workoutToRemove) {
                // Add the calories of the workout to be removed to _totalCalorie
                this._totalCalorie += workoutToRemove.calories;
        
                // Remove the workout from _workouts array
                this._workouts = this._workouts.filter(item => item.id !== +cardID);
        
                // Render and save changes
                this._render();
                this._saveToLS();
                localStorage.setItem('totalCals', this._totalCalorie);
            }
        }
        
    
     addWorkout (workout) {         //function
            this._workouts.push(workout);
    this._totalCalorie -= workout.calories;
    this._render();
    
    localStorage.setItem('totalCals', this._totalCalorie);
        }
    
    
    
    //Privet functions
    _addConsumedCals() {
        let consumedCaloriesDom = document.querySelector('#consumed-cals');
            const consumedCalories = this._meals.reduce((acc, item) => {
                return acc + item.calories;
            }, 0);  
            return consumedCaloriesDom.innerHTML = `<h1>${consumedCalories} <h1>`;
        }
    
    _removeConsumedCals(cardID) {
            let consumedCaloriesDom = document.querySelector('#consumed-cals');
        
            // Find index of the object with the given cardID
            const indexToRemove = this._meals.findIndex(item => item.id === +cardID);
        
            if (indexToRemove !== -1) { // Check if object with the given cardID exists
                // Remove object from _meals array
                this._meals.splice(indexToRemove, 1);
            }
        
            // Recalculate consumed calories
            const consumedCalories = this._meals.reduce((acc, item) => {
                return acc + item.calories;
            }, 0);
            //save to LS
            localStorage.setItem('consumedCals', consumedCalories);
            // Update consumed calories display
      
           return consumedCaloriesDom.innerHTML = `<h1>${consumedCalories}</h1>`;
    
        }
        
    
    
    _addBurnedCals() {
        let burnedCaloriesDom = document.querySelector('#burned-cals');
        const burnedCalories = this._workouts.reduce((acc, item) => {
            return acc + item.calories;
        }, 0);
        //add to LS
        localStorage.setItem('burnedCals', burnedCalories);
        return burnedCaloriesDom.innerHTML = `<h1>${burnedCalories} <h1>`;
    }  
    
    _removeBurnedCals(cardID) {
        let consumedCaloriesDom = document.querySelector('#burned-cals');
        
            // Find index of the object with the given cardID
            const indexToRemove = this._workouts.findIndex(item => item.id === +cardID);
        
            if (indexToRemove !== -1) { // Check if object with the given cardID exists
                // Remove object from _meals array
                this._workouts.splice(indexToRemove, 1);
            }
        
            // Recalculate consumed calories
            const consumedCalories = this._workouts.reduce((acc, item) => {
                return acc + item.calories;
            }, 0);
    
            // Update consumed calories display
           return consumedCaloriesDom.innerHTML = `<h1>${consumedCalories}</h1>`;   
    }
    
    _addRemainingCals() {
        let addRemainingCalsDom = document.querySelector('#rem');
        let remainingDomBG = document.querySelector('#bg-remaining');
        let gainDomBG = document.querySelector('#bg-gain-loss');
    
        const final = this._calorieLimit - this._totalCalorie;
    
        if (this._calorieLimit >= this._totalCalorie) {
          
           remainingDomBG.classList.remove('bg-danger');
           gainDomBG.classList.remove('bg-warning');
            remainingDomBG.classList.add('bg-success');
            gainDomBG.classList.add('bg-success');
            localStorage.setItem('RemainingCals', final );
           return  addRemainingCalsDom.innerHTML = final;
          
        }
    
        else if (this._calorieLimit < this._totalCalorie) {
            remainingDomBG.classList.remove('bg-success');
            gainDomBG.classList.remove('bg-success');
            remainingDomBG.classList.add('bg-danger');
            gainDomBG.classList.add('bg-warning');
            localStorage.setItem('RemainingCals', final);
           return addRemainingCalsDom.innerHTML = final;
        }
    }
    
    
    _gainCalories() {
        const gainLossDom = document.querySelector('#gain-loss');
    
        const final =  this._totalCalorie - this._calorieLimit ;
        localStorage.setItem('gainCals', final);
        this._saveToLS();
       return  gainLossDom.innerHTML = `<h1>${final}</h1>`;
    }
    
    _setRange () {
    let range = document.querySelector('#progress-bar');
    
    if (this._totalCalorie < 0)  
          {
                range.innerHTML =  `<div class="progress-bar progress-bar-striped bg-success" 
        style="width: ${0}%" aria-valuenow="${0}" aria-valuemin="0" 
        aria-valuemax="100">${0}% </div>`; 
        localStorage.setItem('range',   range.innerHTML );
            }
    
    
    else if (this._totalCalorie >= 0) { 
    const final = (this._totalCalorie/this._calorieLimit)*100;
     
        if (final < 0) {
            range.innerHTML =  `<div class="progress-bar progress-bar-striped bg-success" 
    style="width: ${0}%" aria-valuenow="${0}" aria-valuemin="0" 
    aria-valuemax="100">${0}% </div>`; 
    localStorage.setItem('range',   range.innerHTML );
        }
        else if (this._totalCalorie === 0) {
            range.innerHTML =  `<div class="progress-bar progress-bar-striped bg-success" 
    style="width: ${0}%" aria-valuenow="${0}" aria-valuemin="0" 
    aria-valuemax="100">${0}% </div>`; 
    localStorage.setItem('range',   range.innerHTML );
        }
        else if (this._totalCalorie <= this._calorieLimit) {
    range.innerHTML =  `<div class="progress-bar progress-bar-striped bg-success" 
    style="width: ${Math.round(final)}%" aria-valuenow="${Math.round(final)}" aria-valuemin="0" 
    aria-valuemax="100">${Math.round(final)}% </div>`;
    localStorage.setItem('range',   range.innerHTML );
      }
    else if (this._totalCalorie > this._calorieLimit ) {
        range.innerHTML =  `<div class="progress-bar progress-bar-striped bg-danger" 
    style="width: ${100}%" aria-valuenow="${100}" aria-valuemin="0" 
    aria-valuemax="100">${100}% </div>`; 
    localStorage.setItem('range',   range.innerHTML );
     }
    }}
    
    
    _addMealCard (name, cal, id) {
    const mealWrapper = document.querySelector('#meal-wrapper');
    let div = document.createElement('div');
    div.classList.add('box','border', 'd-flex','justify-content-between','align-items-center', 'border-1', 'p-3', 'm-4', 'rounded-2');  //d-flex justify-content-between align-items-center
    div.setAttribute('id', id);
    div.innerHTML = `<div  class="btn btn-success d-inline me-2" id="btn-meal-cal ms-auto">${cal}</div> <p>${name}</p>
    <button class="btn btn-close" id="item-close-button"></button>`;
    mealWrapper.appendChild(div);
    }
    
    _addWorkoutCard (name, cal, id) {
        const workoutWrapper = document.querySelector('#workout-wrapper');
        let div = document.createElement('div');
        div.classList.add('box','border', 'd-flex','justify-content-between','align-items-center', 'border-1', 'p-3', 'm-4', 'rounded-2');  //d-flex justify-content-between align-items-center
        div.setAttribute('id', id);
        div.innerHTML = `<div class="btn btn-warning d-inline me-2" id="btn-meal-cal ms-auto">${cal}</div> <p>${name}</p>
        <button class="btn btn-close" id="item-close-button"></button>`;
        workoutWrapper.appendChild(div);
        }
    
    _saveToLS () {
    
        let consumed = this._meals.reduce((acc, item) => {
            return acc + item.calories;
        }, 0);
        localStorage.setItem('consumedCals', consumed);
        let burned = this._workouts.reduce((acc, item) => {
            return acc + item.calories;
        }, 0);
        localStorage.getItem('burnedCals', burned);
    }
    
    
    
    _render() {                             //to load when adding meal or workout or anything else // in vanilla JS we have to render after adding/removing it is not automatic like in React!
        this._addConsumedCals();
        this._addBurnedCals();
        this._addRemainingCals();
        this._gainCalories();
        this._setRange();
        this._saveToLS ();
    }
    }

    export default Track;