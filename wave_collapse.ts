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


//Data structure, a map, that helps us to store coordinates in a map (since normal map would)
//store them as pointer, not a value
class CoordMap<Z>{

    //We serialize the coord value into a string, because strings in TypeScript maps
    //are search by value, not a pointer
    private map : Map<string, Z>;

    constructor(){
        this.map = new Map<string, Z>();
    }

    private coordToString(coord : Coord) : string {
        return coord.x.toFixed(0) + "_" + coord.y.toFixed(0);
    }

    private stringToCoord(strCoord : string) : Coord {
        const parsedStr : Array<string> = strCoord.split("_");
        const x : number = parseInt(parsedStr[0]);
        const y : number = parseInt(parsedStr[1]);
        return {x : x, y : y};
    }

    set(key: Coord, val : Z) : void {
        this.map.set(this.coordToString(key), val);
    }

    get(key : Coord) : Z {
        return this.map.get(this.coordToString(key));
    }

    has(key : Coord) : boolean {
        return this.map.has(this.coordToString(key));
    }

    delete(key : Coord) : void {
        this.map.delete(this.coordToString(key));
    }

    clear() : void {
        this.map.clear();
    }
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
    constructor(){
        this.type = new Set<number>([0, 1, 2, 3]);
    }

    //Draw the tile, the x,y are left-upper corner
    draw(coord : Coord, context : any) : void {
        if (!this.isCollapsed){
            throw "Not collapsed"
        }
        const imgId : string = "frame" + this.getType();
        const imgElement : HTMLElement = document.getElementById(imgId);
        context.drawImage(imgElement, coord.x * IMG_SIZE, coord.y * IMG_SIZE, IMG_SIZE, IMG_SIZE);
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

    //Returns the type of the Tile if it has already collapsed
    getType() : number {
        //Now we know, that the size is 1, so we can just return the first item
        return this.type.values().next().value;
    }

    //Set state of this Tile as a random one of the given states
    setStateAsRandom(){
        const randomPosition : number = Math.floor(Math.random() * (this.type.size));
        this.type = new Set<number>([Array.from(this.type)[randomPosition]]);
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

//The board is a top level facade for all Rules, Tiles and drawing related logic
//We want to only interact with the board as for all wave function algorithm from outside 
class Board {

    context : any;
    board : CoordMap<Tile>;
    rules : Rules;
    //Number of images we can get to the board both vertically and horizontally 
    sideTiles : number;

    constructor(){
        this.board = new CoordMap<Tile>();
        this.sideTiles = SIDE_SIZE/IMG_SIZE;
        //We fill the board with empty tiles
        for (let i : number = 0; i < this.sideTiles; i ++){
            for (let k : number = 0; k < this.sideTiles; k ++){
                this.board.set({x: i, y : k}, new Tile());
            }
        }
        this.rules = Tile.createDefaultRules();
        this.context = this.setupCanvas();
    }

    private setupCanvas() : any {
        const canvas : any= document.getElementById("drawBoard");
        const ctx : any= canvas.getContext("2d");
        ctx.clearRect(0, 0, SIDE_SIZE, SIDE_SIZE);
        return ctx;
    }
    
    //Return tile on the board with minimal entropy
    //We use this tile as the next one to collapse to lower the collision risk
    getMinimalEntropyTileCoord() : Coord {
        let minCoord : Coord = {x: 0, y: 0}; 
        let minEntropy: number = this.board.get(minCoord).getEntropy();

        for (let i : number = 0; i < this.sideTiles; i ++){
            for (let k : number = 0; k < this.sideTiles; k ++){
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



        const collapsingTile : Tile = this.board.get(coord);

        //The tile is outside of the board or it has already collapsed => we do not collapse it anymore
        if (collapsingTile === undefined || collapsingTile.isCollapsed() === true){
            return;
        }

        // We apply the rules only if the tile exists (canvas borders) and is collapsed
        const upTile : Tile = this.board.get({x : coord.x, y : coord.y + 1});
        if (upTile !== undefined && upTile.isCollapsed()){
            //We get all the possibilities down from the up-tile
            const possibilites : Set<number> = this.rules.rules.get(upTile.getType()).get(Direction.DOWN);
            //We delete all restricted possibilities from the types of the collapsing tile
            collapsingTile.restrictType(possibilites);
        }

        const downTile : Tile = this.board.get({x : coord.x, y : coord.y - 1});
        if (downTile !== undefined && downTile.isCollapsed()){
            const possibilites : Set<number> = this.rules.rules.get(downTile.getType()).get(Direction.UP);
            //We delete all restricted possibilities from the types of the collapsing tile
            collapsingTile.restrictType(possibilites);
        }

        const rightTile : Tile = this.board.get({x : coord.x + 1, y : coord.y});
        if (rightTile !== undefined && rightTile.isCollapsed()){
            const possibilites : Set<number> = this.rules.rules.get(rightTile.getType()).get(Direction.LEFT);
            //We delete all restricted possibilities from the types of the collapsing tile
            collapsingTile.restrictType(possibilites);
        }

        const leftTile : Tile = this.board.get({x : coord.x + 1, y : coord.y});
        if (leftTile !== undefined && leftTile.isCollapsed()){
            const possibilites : Set<number> = this.rules.rules.get(leftTile.getType()).get(Direction.RIGHT);
            //We delete all restricted possibilities from the types of the collapsing tile
            collapsingTile.restrictType(possibilites);
        }

        //We have no possibilites to chose from -> contradiction
        //We have to start over from somewhere (for simple wfa implementation)
        //In more advanced one, we could backtrack
        if (collapsingTile.getEntropy() < 1){
            throw "Contradiction!"
        }

        console.log("Collapsing tile [" + coord.x + ", " + coord.y + "] with " + collapsingTile.getEntropy() + " possibilities")

        //We chose random state from the allowed ones
        collapsingTile.setStateAsRandom();

        console.log("Collapsed tile [" + coord.x + ", " + coord.y + "] to type " + collapsingTile.getType());
    
        //We render the collapsed tile 
        this.renderTile(coord);

        //
        setTimeout(() => {
        //We recursively collapse all the surrounding tiles
        this.collapseTile({x: coord.x, y: coord.y + 1});
        this.collapseTile({x : coord.x, y : coord.y - 1});
        this.collapseTile({x : coord.x + 1, y : coord.y});
        this.collapseTile({x : coord.x - 1, y : coord.y});
        }, 500)
    }

    //Return a coord of a random tile, that belongs to the canvas
    //We use this to start the collapse at the beginning, later we use lowest entropy tile, not random
    getRandomTileCoord() : Coord {
        const x : number = Math.floor(Math.random() * (this.sideTiles));
        const y : number = Math.floor(Math.random() * (this.sideTiles));
        return {x : x, y : y};
    }

    renderTile(tile : Coord) : void {
        this.board.get(tile).draw(tile, this.context);
    }

    //Render the contents of the board
    renderBoard() : void {
        const tile : Coord = this.getRandomTileCoord();

        this.collapseTile(tile);
    }
}

const start = () => {
    const brd : Board = new Board();
    brd.renderBoard();

}

document.getElementById("startButton").addEventListener("click", start);