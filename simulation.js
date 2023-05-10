window.onload = function() {
let pauseSimulation = false;

let timeScale = 1;
const speedSlider = document.getElementById('speed-slider');
speedSlider.addEventListener('input', function() {
    timeScale = parseFloat(this.value);
});


class Animal {
    constructor(x, y, generation = 0, speed = Math.min(Math.floor(Math.random() * 5) + 1, 5), iq = Math.floor(Math.random() * 10) + 1, efficiency = Math.min(Math.floor(Math.random() * 5) + 1, 3)) {
        console.log("Animal created at position: ", x, y);
        this.x = x;
        this.y = y;
        this.size = 10;
        this.food = 100;
        this.dead = false;
        this.generation = generation;
        this.speed = speed;
        this.iq = iq;
        this.efficiency = efficiency;
        this.deathTime = null;
        // Generate a random color for the animal
        this.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    }

    draw() {
        console.log("Drawing animal at position: ", this.x, this.y);
        const radius = this.dead ? this.size / 2 : this.size;
        ctx.fillStyle = this.dead ? 'gray' : this.color;
        ctx.strokeStyle = this.dead ? 'gray' : 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }



    move(foodItems) {
        if (!this.dead) {
            if (Math.random() < this.iq / 10 && foodItems.length > 0) {
                const nearestFood = foodItems.reduce((nearest, food) => {
                    const d = Math.sqrt((food.x - this.x) ** 2 + (food.y - this.y) ** 2);
                    return (nearest && nearest.d < d) ? nearest : { food, d };
                }, null).food;
                const dx = nearestFood.x - this.x;
                const dy = nearestFood.y - this.y;
                const d = Math.sqrt(dx ** 2 + dy ** 2);
                this.x += 0.5 * this.speed * dx / d * timeScale;
                this.y += 0.5 * this.speed * dy / d * timeScale;
            } else {
                const angle = Math.random() * 2 * Math.PI;
                this.x += 0.5 * this.speed * Math.cos(angle) * timeScale;
                this.y += 0.5 * this.speed * Math.sin(angle) * timeScale;
            }
            this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
            this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
        }
    }
    

    consume(foodItems, carcasses) {
        if (!this.dead) {
            foodItems.forEach((food, index) => {
                if (Math.sqrt((food.x - this.x) ** 2 + (food.y - this.y) ** 2) < this.size + food.size) {
                    this.food++;
                    foodItems.splice(index, 1);
                }
            });
            carcasses.forEach((carcass, index) => {
                if (Math.sqrt((carcass.x - this.x) ** 2 + (carcass.y - this.y) ** 2) < this.size + carcass.size / 2) {
                    this.food += 2;
                    carcasses.splice(index, 1);
                }
            });
        }
    }

    draw() {
        console.log("Drawing animal at position: ", this.x, this.y);
        const radius = this.dead ? this.size / 2 : this.size;
        const gradient = ctx.createRadialGradient(this.x, this.y, radius / 5, this.x, this.y, radius);
        gradient.addColorStop(0, `hsl(${this.generation * 50}, 50%, 50%)`);
        gradient.addColorStop(1, 'white');
        ctx.fillStyle = this.dead ? 'gray' : gradient;
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
        
                // If the animal's food supply is depleted, it dies
                if (this.food <= 0) {
                    this.dead = true;
                    this.deathTime = Date.now();
                }
            
        
     // If the animal has enough food, it reproduces
     if (this.food >= 85) { // Increased the minimum food threshold
        this.food -= 20;
        const x = this.x + Math.random() * 20 - 10;
        const y = this.y + Math.random() * 20 - 10;
        const generation = this.generation + 1;
        const speed = Math.max(1, this.speed + Math.ceil(Math.random() * 3) *.0008);
        const iq = Math.max(1, this.iq + Math.ceil(Math.random() * 3) - 1);
        const efficiency = Math.max(1, this.efficiency + Math.ceil(Math.random() * 3) - 1);
        return new Animal(x, y, generation, speed, iq, efficiency);
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

function restart() {
    pauseSimulation = false;
    animals = [];
    foodItems = [];
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * (canvas.width - 20) + 10;  // Adjusted
        const y = Math.random() * (canvas.height - 20) + 10; // Adjusted
        animals.push(new Animal(x, y));
    }
}
    
    let animals = [];
    for (let i = 0; i < 25; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        animals.push(new Animal(x, y));
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
        if (animalCount > 0) {
            maxGeneration = Math.max(...animals.map(animal => animal.generation));
        }
    
        statusBar.innerHTML = `Animals: ${animalCount} | Food: ${foodCount} | Generations: ${maxGeneration}`;
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
                animal.consume(foodItems, animals);
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
        for (let i = 0; i < 50; i++) {
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
