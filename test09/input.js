export class Input{
    constructor(game){
        this.game = game;
        this.keys = [];
        window.addEventListener('keydown',e => {
            if((e.key === 'ArrowRight' ||
                e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'Enter'
            ) && this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key);
            }if(e.key === 'd') this.game.debug = !this.game.debug;
        })
        window.addEventListener('keyup',e => {
            if(e.key === 'ArrowRight' ||
                e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'Enter'
             ){
                this.keys.splice(this.keys.indexOf(e.key),1);
            }
        })
    }
}