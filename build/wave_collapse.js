const IMG_SIZE = 48;
const SIDE_SIZE = 720;
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
})(Direction || (Direction = {}));
//Data structure, a map, that helps us to store coordinates in a map (since normal map would)
//store them as pointer, not a value
class CoordMap {
    constructor() {
        this.map = new Map();
    }
    coordToString(coord) {
        return coord.x.toFixed(0) + "_" + coord.y.toFixed(0);
    }
    stringToCoord(strCoord) {
        const parsedStr = strCoord.split("_");
        const x = parseInt(parsedStr[0]);
        const y = parseInt(parsedStr[1]);
        return { x: x, y: y };
    }
    set(key, val) {
        this.map.set(this.coordToString(key), val);
    }
    get(key) {
        return this.map.get(this.coordToString(key));
    }
    has(key) {
        return this.map.has(this.coordToString(key));
    }
    delete(key) {
        this.map.delete(this.coordToString(key));
    }
    clear() {
        this.map.clear();
    }
}
//Class representing rules for each type of tile
class Rules {
    constructor() {
        this.rules = new Map();
    }
    //We add a new allowed neighbour in a given direction 
    addDirectionRule(type, direction, allowedNeighbour) {
        let directionRule = this.rules.get(type);
        directionRule.get(direction).add(allowedNeighbour);
    }
}
//Basic class representing a tile on a board with a default picture from /frames directory
class Tile {
    //We create the tile with all possibilites
    constructor() {
        this.type = new Set([0, 1, 2, 3]);
    }
    //Draw the tile, the x,y are left-upper corner
    draw(coord, context) {
        if (!this.isCollapsed) {
            throw "Not collapsed";
        }
        const imgId = "frame" + this.getType();
        const imgElement = document.getElementById(imgId);
        context.drawImage(imgElement, coord.x * IMG_SIZE, coord.y * IMG_SIZE, IMG_SIZE, IMG_SIZE);
    }
    //Return true if the wave function of this tile is collapsed
    isCollapsed() {
        return this.type.size === 1;
    }
    //Return entropy as number -> we measure it as number of states
    //that the tile is in
    getEntropy() {
        return this.type.size;
    }
    //Restrict the type of this tile accordingly to allowed set of values 
    restrictType(allowed) {
        this.type.forEach((type) => {
            if (!allowed.has(type)) {
                this.type.delete(type);
            }
        });
    }
    //Returns the type of the Tile if it has already collapsed
    getType() {
        //Now we know, that the size is 1, so we can just return the first item
        return this.type.values().next().value;
    }
    //Set state of this Tile as a random one of the given states
    setStateAsRandom() {
        const randomPosition = Math.floor(Math.random() * (this.type.size));
        this.type = new Set([Array.from(this.type)[randomPosition]]);
    }
    //Creates default rules for tiles from the /frames directory
    static createDefaultRules() {
        let result = new Rules();
        let rulesForZero = new Map();
        rulesForZero.set(Direction.UP, new Set([2, 3]));
        rulesForZero.set(Direction.DOWN, new Set([2, 3]));
        rulesForZero.set(Direction.RIGHT, new Set([1, 2]));
        rulesForZero.set(Direction.LEFT, new Set([1, 2]));
        result.rules.set(0, rulesForZero);
        let rulesForOne = new Map();
        rulesForOne.set(Direction.UP, new Set([2, 3]));
        rulesForOne.set(Direction.DOWN, new Set([2, 3]));
        rulesForOne.set(Direction.RIGHT, new Set([0, 3]));
        rulesForOne.set(Direction.LEFT, new Set([0, 3]));
        result.rules.set(1, rulesForOne);
        let rulesForTwo = new Map();
        rulesForTwo.set(Direction.UP, new Set([0, 1]));
        rulesForTwo.set(Direction.DOWN, new Set([0, 1]));
        rulesForTwo.set(Direction.RIGHT, new Set([3, 0]));
        rulesForTwo.set(Direction.LEFT, new Set([3, 0]));
        result.rules.set(2, rulesForTwo);
        let rulesForThree = new Map();
        rulesForThree.set(Direction.UP, new Set([0, 1]));
        rulesForThree.set(Direction.DOWN, new Set([0, 1]));
        rulesForThree.set(Direction.RIGHT, new Set([2, 1]));
        rulesForThree.set(Direction.LEFT, new Set([2, 1]));
        result.rules.set(3, rulesForThree);
        return result;
    }
}
//The board is a top level facade for all Rules, Tiles and drawing related logic
//We want to only interact with the board as for all wave function algorithm from outside 
class Board {
    constructor() {
        this.board = new CoordMap();
        this.sideTiles = SIDE_SIZE / IMG_SIZE;
        //We fill the board with empty tiles
        for (let i = 0; i < this.sideTiles; i++) {
            for (let k = 0; k < this.sideTiles; k++) {
                this.board.set({ x: i, y: k }, new Tile());
            }
        }
        this.rules = Tile.createDefaultRules();
        this.context = this.setupCanvas();
    }
    setupCanvas() {
        const canvas = document.getElementById("drawBoard");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, SIDE_SIZE, SIDE_SIZE);
        return ctx;
    }
    //Return tile on the board with minimal entropy
    //We use this tile as the next one to collapse to lower the collision risk
    getMinimalEntropyTileCoord() {
        let minCoord = { x: 0, y: 0 };
        let minEntropy = this.board.get(minCoord).getEntropy();
        for (let i = 0; i < this.sideTiles; i++) {
            for (let k = 0; k < this.sideTiles; k++) {
                const currentCoord = { x: i, y: k };
                const currentEntropy = this.board.get(currentCoord).getEntropy();
                if (minEntropy > currentEntropy) {
                    minEntropy = currentEntropy;
                    minCoord = currentCoord;
                }
            }
        }
        return minCoord;
    }
    //Collapse a given tile
    collapseTile(coord) {
        const collapsingTile = this.board.get(coord);
        //The tile is outside of the board or it has already collapsed => we do not collapse it anymore
        if (collapsingTile === undefined || collapsingTile.isCollapsed() === true) {
            return;
        }
        // We apply the rules only if the tile exists (canvas borders) and is collapsed
        const upTile = this.board.get({ x: coord.x, y: coord.y + 1 });
        if (upTile !== undefined && upTile.isCollapsed()) {
            //We get all the possibilities down from the up-tile
            const possibilites = this.rules.rules.get(upTile.getType()).get(Direction.DOWN);
            //We delete all restricted possibilities from the types of the collapsing tile
            collapsingTile.restrictType(possibilites);
        }
        const downTile = this.board.get({ x: coord.x, y: coord.y - 1 });
        if (downTile !== undefined && downTile.isCollapsed()) {
            const possibilites = this.rules.rules.get(downTile.getType()).get(Direction.UP);
            //We delete all restricted possibilities from the types of the collapsing tile
            collapsingTile.restrictType(possibilites);
        }
        const rightTile = this.board.get({ x: coord.x + 1, y: coord.y });
        if (rightTile !== undefined && rightTile.isCollapsed()) {
            const possibilites = this.rules.rules.get(rightTile.getType()).get(Direction.LEFT);
            //We delete all restricted possibilities from the types of the collapsing tile
            collapsingTile.restrictType(possibilites);
        }
        const leftTile = this.board.get({ x: coord.x + 1, y: coord.y });
        if (leftTile !== undefined && leftTile.isCollapsed()) {
            const possibilites = this.rules.rules.get(leftTile.getType()).get(Direction.RIGHT);
            //We delete all restricted possibilities from the types of the collapsing tile
            collapsingTile.restrictType(possibilites);
        }
        //We have no possibilites to chose from -> contradiction
        //We have to start over from somewhere (for simple wfa implementation)
        //In more advanced one, we could backtrack
        if (collapsingTile.getEntropy() < 1) {
            throw "Contradiction!";
        }
        console.log("Collapsing tile [" + coord.x + ", " + coord.y + "] with " + collapsingTile.getEntropy() + " possibilities");
        //We chose random state from the allowed ones
        collapsingTile.setStateAsRandom();
        console.log("Collapsed tile [" + coord.x + ", " + coord.y + "] to type " + collapsingTile.getType());
        //We render the collapsed tile 
        this.renderTile(coord);
        //
        setTimeout(() => {
            //We recursively collapse all the surrounding tiles
            this.collapseTile({ x: coord.x, y: coord.y + 1 });
            this.collapseTile({ x: coord.x, y: coord.y - 1 });
            this.collapseTile({ x: coord.x + 1, y: coord.y });
            this.collapseTile({ x: coord.x - 1, y: coord.y });
        }, 1000);
    }
    //Return a coord of a random tile, that belongs to the canvas
    //We use this to start the collapse at the beginning, later we use lowest entropy tile, not random
    getRandomTileCoord() {
        const x = Math.floor(Math.random() * (this.sideTiles));
        const y = Math.floor(Math.random() * (this.sideTiles));
        return { x: x, y: y };
    }
    renderTile(tile) {
        this.board.get(tile).draw(tile, this.context);
    }
    //Render the contents of the board
    renderBoard() {
        const tile = this.getRandomTileCoord();
        this.collapseTile(tile);
    }
}
const start = () => {
    const brd = new Board();
    brd.renderBoard();
};
document.getElementById("startButton").addEventListener("click", start);
