import { player } from "./player.js";
import { Input } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy,GroundEnemy,ClimbingEnemy } from "./enemies.js";
import { UI } from "./UI.js";

window.addEventListener('load',function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    class Game {
        constructor(gameWidth,gameHeight){
            this.width = gameWidth;
            this.height = gameHeight;
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 3;
            this.background = new Background(this);
            this.player = new player(this);
            this.input = new Input(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessage = [];
            this.maxParticles = 50;
            this.enemyInterval = 1000;
            this.enemyTimer = 0;
            this.debug = true;
            this.score = 0;
            this.winningScore = 40;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 30000;
            this.lives = 5;
            this.gameOver = false;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }
        update(deltaTime){
            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input,deltaTime);
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            };
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            })
            this.particles.forEach((particle,index) =>{
                particle.update();
            })
            this.floatingMessage.forEach(floatingMesage =>{
                floatingMesage.update();
            })
            if(this.particles.length > this.maxParticles){
                this.particles.length = this.maxParticles;
            }
            this.collisions.forEach((collision,index) => {
                collision.update(deltaTime);
            })
            this.enemies = this.enemies.filter(enemy => !enemy.markerForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessage = this.floatingMessage.filter(message => !message.markedForDeletion);
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(paarticle => {
                paarticle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.floatingMessage.forEach(floatingMesage =>{
                floatingMesage.draw(context);
            })
            this.UI.draw(context);
        }
        addEnemy(){
            if(this.speed > 0 && Math.random() > 0.5) this.enemies.push(new GroundEnemy(this));
            else if(this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }
    }

    const game = new Game(canvas.width,canvas.height);
    let lastTime = 0;
    function animate(timeStamp){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.update(deltaTime);
        game.draw(ctx);
        if(!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
})

