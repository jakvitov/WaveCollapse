const imgSize : number = 48;
const SCALE :  number = 1;
const SIDE_SIZE : number = 720;


class Tile {
    type : Number;

    constructor(type : Number){
        this.type = type;
    }

    //Draw the tile, the x,y are left-upper corner
    draw(x : Number, y: Number, context : any) : void {
        const imgId : string = "frame" + this.type;
        const imgElement : HTMLElement = document.getElementById(imgId);
        context.drawImage(imgElement, x, y, imgSize * SCALE, imgSize * SCALE);
    }
}

const setupDrawBoard = () : any => {
    const canvas : any= document.getElementById("drawBoard");
    const ctx : any= canvas.getContext("2d");
    ctx.clearRect(0, 0, SIDE_SIZE, SIDE_SIZE);
    return ctx;
}


const start = () => {

    const context : any = setupDrawBoard();

    const tile : Tile = new Tile(1);

    const tile2 : Tile = new Tile (2);
    tile.draw(0, 0, context);
    tile2.draw(48, 0, context);
}

document.getElementById("startButton").addEventListener("click", start);