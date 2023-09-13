const IMG_SIZE : number = 48;
const SIDE_SIZE : number = 720;


enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

interface Coord {
    x : number;
    y : number;
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

    type : Set<number>;

    //We create the tile with all possibilites
    constructor(coord : Coord){
        this.type = new Set<number>([0, 1, 2, 3]);
    }

    //Draw the tile, the x,y are left-upper corner
    draw(x : Number, y: Number, context : any) : void {
        if (!this.isCollapsed){
            throw "Not collapsed"
        }
        const imgId : string = "frame" + this.type[0];
        const imgElement : HTMLElement = document.getElementById(imgId);
        context.drawImage(imgElement, x, y, IMG_SIZE, IMG_SIZE);
    }

    //Return true if the wave function of this tile is collapsed
    isCollapsed() : boolean {
        return this.type.size === 1;
    }

    //Return entropy as number -> we measure it as number of states
    //that the tile is in
    getEntropy() : number {
        return this.type.size;
    }

    //Restrict the type of this tile accordingly to allowed set of values 
    restrictType(allowed : Set<number>) : void {
        this.type.forEach((type) => {
            if (!allowed.has(type)){
                this.type.delete(type);
            }
        })
    }

    //Creates default rules for tiles from the /frames directory
    static createDefaultRules() : Rules {
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

        return result;
    }
}

class Board{

    board : Map<Coord, Tile>;
    rules : Rules;

    constructor(){
        const sideTiles : number = SIDE_SIZE/IMG_SIZE;
        //We fill the board with empty tiles
        for (let i : number = 0; i < sideTiles; i ++){
            for (let k : number = 0; k < sideTiles; k ++){
                this.board.set({x: i, y : k}, new Tile({x: i, y : k}))
            }
        }
        this.rules = Tile.createDefaultRules();
    }

    //Return tile on the board with minimal entropy
    //We use this tile as the next one to collapse to lower the collision risk
    getMinimalEntropyTileCoord() : Coord {
        let minCoord : Coord = {x: 0, y: 0}; 
        let minEntropy: number = this.board.get(minCoord).getEntropy();

        const sideTiles : number = SIDE_SIZE/IMG_SIZE;

        for (let i : number = 0; i < sideTiles; i ++){
            for (let k : number = 0; k < sideTiles; k ++){
                const currentCoord : Coord = {x : i, y : k}
                const currentEntropy : number = this.board.get(currentCoord).getEntropy();
                if (minEntropy > currentEntropy){
                    minEntropy = currentEntropy;
                    minCoord = currentCoord;
                }
            }
        } 
        
        return minCoord;
    }

    //Collapse a given tile
    collapseTile(coord : Coord){
        const upTile : Tile = this.board.get({x : coord.x, y : coord.y + 1});
        if (upTile && upTile.isCollapsed){
            //We get all the possibilities down from the up-tile
            const possibilites : Set<number> = this.rules.rules.get(upTile.type[0]).get(Direction.DOWN);
            //We delete all restricted possibilities from the types of the collapsing tile
            this.board.get(coord).restrictType(possibilites);
        }

        const downTile : Tile = this.board.get({x : coord.x, y : coord.y - 1});
        if (downTile && downTile.isCollapsed){
            //We get all the possibilities down from the up-tile
            const possibilites : Set<number> = this.rules.rules.get(downTile.type[0]).get(Direction.UP);
            //We delete all restricted possibilities from the types of the collapsing tile
            this.board.get(coord).restrictType(possibilites);
        }

        const rightTile : Tile = this.board.get({x : coord.x + 1, y : coord.y});
        if (rightTile && rightTile.isCollapsed){
            //We get all the possibilities down from the up-tile
            const possibilites : Set<number> = this.rules.rules.get(rightTile.type[0]).get(Direction.LEFT);
            //We delete all restricted possibilities from the types of the collapsing tile
            this.board.get(coord).restrictType(possibilites);
        }

        const leftTile : Tile = this.board.get({x : coord.x + 1, y : coord.y});
        if (leftTile && leftTile.isCollapsed){
            //We get all the possibilities down from the up-tile
            const possibilites : Set<number> = this.rules.rules.get(leftTile.type[0]).get(Direction.LEFT);
            //We delete all restricted possibilities from the types of the collapsing tile
            this.board.get(coord).restrictType(possibilites);
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



}

document.getElementById("startButton").addEventListener("click", start);