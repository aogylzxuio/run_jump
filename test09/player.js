import { Sitting,Running,Jumping,Falling,Rolling,Diving,Hit } from "./playerState.js";
import { CollisionAnimation } from "./collisionAnimation.js"
import { FloatingMessage } from "./floatingMessage.js";

export class player{
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 30;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;
        this.speed = 0;
        this.maxspeed = 10;
        this.vy = 0;
        this.weight = 1;
        this.states = [new Sitting(this.game),new Running(this.game),new Jumping(this.game),new Falling(this.game),new Rolling(this.game),new Diving(this.game),new Hit(this.game)];
        this.currentState = null;
    }
    update(input,deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input.keys);
        this.x += this.speed;
        if(input.keys.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxspeed;
        else if(input.keys.includes('ArrowLeft')&& this.currentState !== this.states[6]) this.speed = -this.maxspeed;
        else this.speed = 0;
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        // if(input.keys.includes('ArrowUp') && this.onGround()) this.vy = -20;
        this.y += this.vy;
        if(!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        if(this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin
        if(this.frameTimer > this.frameInterval){
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            this.frameTimer = 0;
        } else this.frameTimer += deltaTime;
    }
    draw(context){
        if(this.game.debug) context.strokeRect(this.x,this.y,this.width,this.height);
        context.drawImage(this.image,this.frameX * this.width,this.frameY * this.height,this.width,this.height,this.x,this.y,this.width,this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state,speed){
        this.currentState = this.states[state];
        this.game.speed = speed * this.game.maxSpeed;
        this.currentState.enter();
    }
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if(
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ){
                enemy.markerForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game,enemy.x + enemy.width * 0.5,enemy.y + enemy.height * 0.5));
                if(this.currentState === this.states[4] || this.currentState === this.states[5]){
                    this.game.score++;
                    this.game.floatingMessage.push(new FloatingMessage('+1',enemy.x,enemy.y,150,50));
                } else {
                    this.setState(6,0);
                    this.game.score-=5;
                    this.game.lives--;
                    if(this.game.lives <= 0) this.game.gameOver = true;
                }
            }
        })
    }
}