import * as apiw from '@duckos-apps/apiw';
import * as fs from '@duckos-apps/fs'
export class Vector {
    constructor(
        public x: number,
        public y: number
    ) {}
    add(vec: Vector) {
        return new Vector(vec.x+this.x, vec.y+this.y);
    }
    sub(vec: Vector) {
        return new Vector(this.x-vec.x, this.y-vec.y);
    }
    mul(vec: Vector) {
        return new Vector(this.x * vec.x, this.y * vec.y)
    }
    div(vec: Vector) {
        return new Vector(this.x / vec.x, this.y / vec.y)
    }
    static sq(x: number) { // square
        return new Vector(x, x);
    }
    *[Symbol.iterator]() {
        /*let doneX = false;
        return () => {
            if (doneX) return { value: this.y, done: true };
            doneX = true;
            return { value: this.x, done: false };
        }*/
        yield this.x;
        return this.y;
    }
    collides(vec: Vector) {
        return this.x === vec.x && this.y === vec.y;
    }
    static random(max: number) {
        const a = () => Math.floor(Math.random() * max);
        return new Vector(a(), a());
    }
    static X(x: number) {
        return new Vector(x, 0);
    }
    static Y(y: number) {
        return new Vector(0, y);
    }
    
}
function sleep(ms: number) {return new Promise(resolve => setTimeout(resolve, ms))};
export async function main(argv: string[]) {
    let frameRate = 10;
    if (argv.includes('-fr')) {
        frameRate = parseInt(argv[argv.indexOf('-fr')+1]);
    }
    const frameDelta = 1000 / frameRate;

    const [id, canvas] = await api.window.open('canvas', {
        title: 'Snake',
        resizable: false,
        closable: true,
        height: 400,
        width: 400,
        maximizable: false,
        minimizable: true,
        height_max: 400,
        height_min: 400,
        width_max: 400,
        width_min: 400
    });
    const ctx_ = canvas.getContext('2d');
    if (!ctx_) return;
    const ctx = ctx_;
    let times: number[] = [];
    let fps: number = 0;
    ctx.font = '15px Roboto';

    const player = {
        //pos: new Vector(4, 4),
        tailsize: 3,
        direction: new Vector(0, 1)
    }
    const cellSize = 10;
    function spawnSquare(color: string, vec: Vector) {
        ctx.fillStyle = color;
        const pos = vec.mul(Vector.sq(cellSize));
        ctx.fillRect(pos.x, pos.y, cellSize, cellSize);
    }
    function spawnCircle(color: string, vec: Vector) {
        ctx.fillStyle = color;
        const pos = vec.mul(Vector.sq(cellSize));
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, cellSize, 0, 2 * Math.PI);
        ctx.fill();
    }

    let inputQueue: Vector[] = [];
    let snake: Vector[] = [];

    function createSnake() {
        for (let i = player.tailsize; i > 0; i--) {
            snake.push(new Vector(6, i));
        }
    }
    createSnake()
    function drawSnake() {
        ctx.filter = 'drop-shadow(0px 0px 10px red)';
        //spawnSquare('red', player.pos);
        for (let i = 0; i < snake.length; i++) {
            spawnSquare("red", new Vector(snake[i].x, snake[i].y));
        }
        ctx.filter = '';
    }

    function gameOver() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '40px Arial';
        ctx.fillText("Game over", 0, 40);        
    }
    const fruitCount = 15;
    const fruits: Vector[] = [];
    function addFruit() {
        fruits.push(Vector.random(Math.floor(canvas.width/cellSize)-6).sub(Vector.X(3)));
    }
    for (let i = 0; i < fruitCount; i++) addFruit();
    function drawFruits() {
        ctx.filter = 'drop-shadow(0px 0px 10px lime)'
        for (const fruit of fruits) {
            spawnSquare("lime", fruit);
        }
        ctx.filter = ''
    }

    let score = 0;

    async function update() {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps = times.length;
        ctx.fillStyle = 'white';
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillText(`${fps} FPS x${snake[0].x}y${snake[0].y} Score: ${score}`, 8, 14);
        
        let inputvec = inputQueue.pop();
        drawFruits();
        if (inputvec) player.direction = inputvec;
        drawSnake();
        //snake[0] = snake[0].add(player.direction);
        let head = snake[0];
        head = head.add(player.direction);

        let tail = snake.pop();
        if (!tail) return console.error('fail');
        tail = head;
        snake.unshift(tail);
        //console.log(snake, player.direction);
        // wall collision
        if (snake[0].x >= (canvas.width/cellSize)-3) snake[0] = snake[0].add(new Vector(-1, 0));
        if (snake[0].y >= (canvas.height/cellSize)-3) snake[0] = snake[0].add(new Vector(0, -1));
        if (snake[0].x < 3) snake[0] = snake[0].add(new Vector(1, 0));
        if (snake[0].y < 3) snake[0] = snake[0].add(new Vector(0, 1));
        // tail collision
        for (const tail of snake.slice(1)) {
            if (snake[0].collides(tail)) return gameOver();
        }

        for (const [_, fruit] of fruits.entries()) {
            if (snake[0].collides(fruit)) {
                score += 1;
                player.tailsize++;
                snake.push(new Vector(head.x, head.y));
                fruits.splice(_, 1);
                addFruit();
            }
        }

        // le box
        ctx.beginPath()
        ctx.strokeStyle = 'white';
        ctx.moveTo(3 * cellSize, 3 * cellSize);
        ctx.lineTo(((canvas.width / cellSize) - 3) * cellSize, 3 * cellSize);
        ctx.lineTo(((canvas.width / cellSize) - 3) * cellSize, ((canvas.height / cellSize) - 3) * cellSize);
        ctx.moveTo(3 * cellSize, 3 * cellSize);
        ctx.lineTo(3 * cellSize, ((canvas.height / cellSize) - 3) * cellSize);
        ctx.lineTo(((canvas.width / cellSize) - 3) * cellSize, ((canvas.height / cellSize) - 3) * cellSize);
        ctx.stroke();
        
        await sleep(frameDelta);
        requestAnimationFrame(update);
    }
    //setTimeout(update, 100);
    /*for await (const event of apiw.WindowEvents(id)) {
        if (event.type === "close") {
            await api.window.close(id, false);
            break;
        }
    }*/
    //update()
    let gameStarted = false;
    function drawTextInCenter(text: string) {
        ctx.fillStyle = 'white';
        ctx.fillText(text, Math.floor((canvas.width / 2) - (ctx.measureText(text).width / 2)), Math.floor(canvas.height / 2));
    }
    drawTextInCenter("Press [Enter] to start the game.");
    
    api.events.registerEvent(id, 'keydown', async ev => {
        const kev = ev as KeyboardEvent;
        switch (kev.key) {
            case "ArrowRight": {
                //player.direction = new Vector(1, 0);
                inputQueue.push(new Vector(1, 0));
                break;
            }
            case "ArrowLeft": {
                //player.direction = new Vector(-1, 0);
                inputQueue.push(new Vector(-1, 0));
                break;
            }
            case "ArrowUp": {
                //player.direction = new Vector(0, -1);
                inputQueue.push(new Vector(0, -1));
                break;
            }
            case "ArrowDown": {
                //player.direction = new Vector(0, 1);
                inputQueue.push(new Vector(0, 1));
                break;
            }
            case "Enter": {
                if (gameStarted) break;
                gameStarted = true;
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                drawTextInCenter('Loading Roboto font');
                const url = URL.createObjectURL(new Blob([await fs.readFileBuffer("/games/snake/Roboto.woff2")], { type: 'application/woff2' }));
                const robotface = new FontFace('Roboto', `url(${url})`);
                await robotface.load(); // doesn't work in worker threads // nvm it does lol
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                drawTextInCenter('Starting game');
                await sleep(100);
                update();
                break;
            }
        }
    }, false)
    await new Promise(resolve => {
        api.events.registerEvent(id, 'close', resolve, true)
    })
    await api.window.close(id, false);
}