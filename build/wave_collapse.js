const imgSize = 48;
const SCALE = 1;
const SIDE_SIZE = 720;
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
