const imgSize : number = 48;
const SCALE :  number = 1;
const SIDE_SIZE : number = 720;


enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

//Class representing rules for each type of tile
class Rules {

    //Maps tile type to a map of all directions and tile types as possible neighbours
    //in that given direction
    //Exmple: {type1: {UP:[2,3], DOWN:[1], LEFT:[2], RIGHT:[2,1,3]}} ...
    rules : Map<number, Map<Direction, Set<number>>>;

    constructor(){
        this.rules = new Map<number, Map<Direction, Set<number>>>();
    }

    //We add a new allowed neighbour in a given direction 
    addDirectionRule(type : number, direction : Direction, allowedNeighbour : number) : void {
        let directionRule : Map<Direction, Set<number>> = this.rules.get(type);
        directionRule.get(direction).add(allowedNeighbour);
    }
}


//Basic class representing a tile on a board with a default picture from /frames directory
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

    //Creates default rules for tiles from the /frames directory
    createDefaultRules() : void {
        let result : Rules = new Rules();

        let rulesForZero : Map<Direction, Set<number>> = new Map<Direction, Set<number>>();
        rulesForZero.set(Direction.UP, new Set<number>([2, 3]));
        rulesForZero.set(Direction.DOWN, new Set<number>([2, 3]));
        rulesForZero.set(Direction.RIGHT, new Set<number>([1, 2]));
        rulesForZero.set(Direction.LEFT, new Set<number>([1, 2]));
        result.rules.set(0, rulesForZero);

        let rulesForOne : Map<Direction, Set<number>> = new Map<Direction, Set<number>>();
        rulesForOne.set(Direction.UP, new Set<number>([2, 3]));
        rulesForOne.set(Direction.DOWN, new Set<number>([2, 3]));
        rulesForOne.set(Direction.RIGHT, new Set<number>([0, 3]));
        rulesForOne.set(Direction.LEFT, new Set<number>([0, 3]));
        result.rules.set(1, rulesForOne);

        let rulesForTwo : Map<Direction, Set<number>> = new Map<Direction, Set<number>>();
        rulesForTwo.set(Direction.UP, new Set<number>([0, 1]));
        rulesForTwo.set(Direction.DOWN, new Set<number>([0, 1]));
        rulesForTwo.set(Direction.RIGHT, new Set<number>([3, 0]));
        rulesForTwo.set(Direction.LEFT, new Set<number>([3, 0]));
        result.rules.set(2, rulesForTwo);

        let rulesForThree : Map<Direction, Set<number>> = new Map<Direction, Set<number>>();
        rulesForThree.set(Direction.UP, new Set<number>([0, 1]));
        rulesForThree.set(Direction.DOWN, new Set<number>([0, 1]));
        rulesForThree.set(Direction.RIGHT, new Set<number>([2, 1]));
        rulesForThree.set(Direction.LEFT, new Set<number>([2, 1]));
        result.rules.set(3, rulesForThree);


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