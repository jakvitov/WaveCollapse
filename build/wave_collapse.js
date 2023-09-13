const imgSize = 48;
const SCALE = 1;
const SIDE_SIZE = 720;
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
})(Direction || (Direction = {}));
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
    constructor(type) {
        this.type = type;
    }
    //Draw the tile, the x,y are left-upper corner
    draw(x, y, context) {
        const imgId = "frame" + this.type;
        const imgElement = document.getElementById(imgId);
        context.drawImage(imgElement, x, y, imgSize * SCALE, imgSize * SCALE);
    }
    //Creates default rules for tiles from the /frames directory
    createDefaultRules() {
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
const setupDrawBoard = () => {
    const canvas = document.getElementById("drawBoard");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, SIDE_SIZE, SIDE_SIZE);
    return ctx;
};
const start = () => {
    const context = setupDrawBoard();
    const tile = new Tile(1);
    const tile2 = new Tile(2);
    tile.draw(0, 0, context);
    tile2.draw(48, 0, context);
};
document.getElementById("startButton").addEventListener("click", start);
