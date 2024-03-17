class Meal {                            //create meal object
    constructor(name, calories) {
       
        this.id =  new Date().getTime();
        this.name = name;
        this.calories = calories;
         }
    }
    
class Workout {                         //create workout object
    constructor(name, calories) {
        
            this.id =  new Date().getTime();
            this.name = name;
            this.calories = calories;
        }
    }
        
export {Meal, Workout};