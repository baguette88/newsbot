window.onload = function() {
let pauseSimulation = false;
let deaths = 0;
let livingAnimals=0


let timeScale = 1;
const speedSlider = document.getElementById('speed-slider');
speedSlider.addEventListener('input', function() {
    timeScale = parseFloat(this.value);
});


class Animal {
    constructor(x, y, color, level = 0, offspring = 0, speed = Math.min(Math.floor(Math.random() * 5) + 1, 5), iq = Math.floor(Math.random() * 10) + 1, efficiency = Math.min(Math.floor(Math.random() * 5) + 1, 3)) {
        this.x = x;
        this.y = y;
        this.size = 10;
        this.food = 50;
        this.dead = false;
        this.generation = offspring; // Changed here
        this.speed = speed;
        this.iq = iq;
        this.efficiency = efficiency;
        this.deathTime = null;
        this.color = color || `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        this.level = level;
        this.reproduceCooldown = 0;
        this.hasEaten = false;
        this.offspring = offspring;  
        livingAnimals++;  
    }

    draw() {
        const radius = this.dead ? this.size / 2 : this.size;
        ctx.fillStyle = this.dead ? 'gray' : this.color;
        ctx.strokeStyle = this.dead ? 'gray' : 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(this.level, this.x, this.y + 5);
    }


    move(foodItems) {
        if (!this.dead) {
            let newX = this.x;
            let newY = this.y;
    
            const angle = Math.random() * 2 * Math.PI; // define angle here
    
            if (Math.random() < this.iq / 10 && foodItems.length > 0) {
                const nearestFood = foodItems.reduce((nearest, food) => {
                    const d = Math.sqrt((food.x - this.x) ** 2 + (food.y - this.y) ** 2);
                    return (nearest && nearest.d < d) ? nearest : { food, d };
                }, null).food;
                const dx = nearestFood.x - this.x;
                const dy = nearestFood.y - this.y;
                const d = Math.sqrt(dx ** 2 + dy ** 2);
                newX += 0.5 * this.speed * dx / d * timeScale;
                newY += 0.5 * this.speed * dy / d * timeScale;
            } else {
                newX += 0.5 * this.speed * Math.cos(angle) * timeScale;
                newY += 0.5 * this.speed * Math.sin(angle) * timeScale;
            }
    
            // check if new position is inside the canvas
            if (newX - this.size < 0 || newX + this.size > canvas.width) {
                // bounce off the wall by reversing x direction
                newX = this.x - 0.5 * this.speed * Math.cos(angle) * timeScale;
            }
            if (newY - this.size < 0 || newY + this.size > canvas.height) {
                // bounce off the wall by reversing y direction
                newY = this.y - 0.5 * this.speed * Math.sin(angle) * timeScale;
            }
    
            // update position
            this.x = newX;
            this.y = newY;
        }
    }
    
    
    

    consume(foodItems, carcasses, animals) {
        if (!this.dead) {
            foodItems.forEach((food, index) => {
                if (Math.sqrt((food.x - this.x) ** 2 + (food.y - this.y) ** 2) < this.size + food.size) {
                    this.food++;
                    this.hasEaten = true;
                    foodItems.splice(index, 1);
                }
            });
            carcasses.forEach((carcass, index) => {
                if (Math.sqrt((carcass.x - this.x) ** 2 + (carcass.y - this.y) ** 2) < this.size + carcass.size / 2) {
                    this.food += 2;
                    carcasses.splice(index, 1);
                }
            });
            animals.forEach((animal, index) => {
                if (!animal.dead && this.level >= animal.level + 2 && this.color !== animal.color) {
                    // ... the rest of your consumption code ...
                    animal.dead = true;
                    if (!animal.dead) {
                        livingAnimals--;  // Decrement living animals counter
                    }
                    deaths += 1;  // Increment deaths counter only if the animal was alive
                }
            });
        }
    }
    

    draw() {
        const radius = this.dead ? this.size / 2 : this.size;
        ctx.fillStyle = this.dead ? 'gray' : this.color;
        ctx.strokeStyle = this.dead ? 'gray' : 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
    
          
        
            update(timeScale) {
                // Some logic here to update the animal's state
                // For example, you might decrease the animal's food supply:
                this.food -= this.efficiency * timeScale / 10;
                let newLevel = Math.floor(this.food / 20);
                if (newLevel > this.level) {
                    // Level up and grow by 10%
                    this.level = newLevel;
                    this.size *= 1.1;
                }
                this.level = Math.floor(this.food / 20);
                this.reproduceCooldown = Math.max(0, this.reproduceCooldown - timeScale);
                // If the animal's food supply is depleted, it dies
                if (this.food <= 0 && !this.dead) {  // Check if the animal is not already dead
                    this.dead = true;
                    livingAnimals--;  // Decrement living animals counter
                    this.deathTime = Date.now();
                }
            
        
     // If the animal has enough food, it reproduces
     if (this.food >= 85 && this.reproduceCooldown <= 0 && this.hasEaten) {
        this.food -= 40;
        this.reproduceCooldown = 3;  // 3 seconds cooldown
        this.hasEaten = false;
        const x = this.x + Math.random() * 20 - 10;
        const y = this.y + Math.random() * 20 - 10;
        const generation = this.generation + 1;
        const speed = Math.max(1, this.speed + Math.ceil(Math.random() * 3) - 1);
        const iq = Math.max(1, this.iq + Math.ceil(Math.random() * 3) - 1);
        const efficiency = Math.max(1, this.efficiency + Math.ceil(Math.random() * 3) - 1);
        return new Animal(x, y, this.color, this.level, generation, speed, iq, efficiency);
    }


    return null;
            }
        }
class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 5;
    }

    draw() {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
}
    
const canvas = document.getElementById('zoo');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');


let animals = [];
let colors = ['red', 'orange', 'yellow', 'blue', 'indigo', 'violet', 'dark green', 'black', 'white', 'pink'];


function restart() {
    pauseSimulation = false;
    animals = [];
    foodItems = [];
    livingAnimals=0;
    deaths=0;
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * (canvas.width - 2 * Animal.size) + Animal.size;
        const y = Math.random() * (canvas.height - 2 * Animal.size) + Animal.size;
        const colorIndex = i % colors.length;
        animals.push(new Animal(x, y, colors[colorIndex]));
    }
}
    

    
    let foodItems = [];
    
    function spawnFood() {
        const x = Math.random() * (canvas.width - 10) + 5;
        const y = Math.random() * (canvas.height - 10) + 5;
        foodItems.push(new Food(x, y));
    }
    
    function displayStatus() {
        const statusBar = document.getElementById('status-bar');
        const animalCount = animals.length;
        const foodCount = foodItems.length;
        let maxGeneration = 0;
        let maxOffspring = 0;
        if (animalCount > 0) {
            maxGeneration = Math.max(...animals.map(animal => animal.generation));
            maxOffspring = Math.max(...animals.map(animal => animal.offspring));
        }
    
        statusBar.innerHTML = `Animals: ${livingAnimals} | Deaths: ${deaths} | Food: ${foodCount} | Offspring: ${maxOffspring}`; 
    }
    
    
    function removeDeadAnimals() {
        const now = Date.now();
        for (let i = 0; i < animals.length; i++) {
            if (animals[i].dead && now - animals[i].deathTime >= 3000) {
                animals.splice(i, 1);
                i--;
            }
        }
    }
    
    function update() {
        if (!pauseSimulation && timeScale > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            displayStatus();
    
            removeDeadAnimals();
    
            animals.forEach(animal => {
                animal.move(foodItems);
                animal.consume(foodItems, [], animals); // Pass the animals array here
                const offspring = animal.update(timeScale);
                if (offspring) {
                    animals.push(offspring);
                }
                animal.draw();
            });
            foodItems.forEach(food => food.draw());
    
            const foodRateSlider = document.getElementById('food-rate');
            const foodRate = parseFloat(foodRateSlider.value) / 200;
            if (Math.random() < foodRate * timeScale) {
                spawnFood();
            }
        }
    
        requestAnimationFrame(update);
    }

    
    function pause() {
        pauseSimulation = !pauseSimulation;
    }
    
    function restart() {
        pauseSimulation = false;
        animals = [];
        foodItems = [];
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            animals.push(new Animal(x, y));
        }
    }
    
    document.getElementById('restart-button').addEventListener('click', restart);

    update();


    document.getElementById('pause-button').addEventListener('click', pause);
    restart(); 

   window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

    document.getElementById('spawn-animals').addEventListener('click', function() {
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * (canvas.width - 20) + 10;
            const y = Math.random() * (canvas.height - 20) + 10;
            animals.push(new Animal(x, y));
        }
    });

  


};
