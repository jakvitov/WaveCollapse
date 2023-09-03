var imgSize = 48;
var SCALE = 1;
var SIDE_SIZE = 720;
var Tile = /** @class */ (function () {
    function Tile(type) {
        this.type = type;
    }
    //Draw the tile, the x,y are left-upper corner
    Tile.prototype.draw = function (x, y, context) {
        var imgId = "frame" + this.type;
        var imgElement = document.getElementById(imgId);
        context.drawImage(imgElement, x, y, imgSize * SCALE, imgSize * SCALE);
    };
    return Tile;
}());
var setupDrawBoard = function () {
    var canvas = document.getElementById("drawBoard");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, SIDE_SIZE, SIDE_SIZE);
    return ctx;
};
var start = function () {
    var context = setupDrawBoard();
    var tile = new Tile(1);
    var tile2 = new Tile(2);
    tile.draw(0, 0, context);
    tile2.draw(48, 0, context);
};
document.getElementById("startButton").addEventListener("click", start);
