package structures

import (
	"image"
	"image/color"
	"math/rand"
)

// This struct represents a whole image, that is being created using the wave collapse
type WaveImage struct {
	size image.Rectangle

	canvas map[image.Point]*Pixel

	CollapseQueue *Queue[image.Point]

	rules *Rules

	ajacentPixelsDirections *AdjPointDirect
}

func CreateWaveImage(size image.Rectangle, rules *Rules) *WaveImage {
	result := &WaveImage{}
	result.size = size
	//We do not initialize all of the image pixels right away, they get added, as we generate for efficiency
	result.canvas = make(map[image.Point]*Pixel)
	result.CollapseQueue = CreateQueue[image.Point]()
	result.ajacentPixelsDirections = GetAdjacentPoints()
	result.rules = rules
	return result
}

// Direction -> where we want the restriction, contra -> opposite direction of the pixel where we look
func (board *WaveImage) restrictPixelByNeighbour(direction Direction, contraDirection Direction, pixel *Pixel, point image.Point) {
	lookedPoint := direction.Add(point)
	elem, ok := board.canvas[lookedPoint]
	//The pixel exists and is collapsed -> we restrict its possible colors from this neighbour
	if ok && elem.isCollapsed == false {
		pixel.restrictedColors.mergeSet(board.rules.GetRuleForDirection(elem.color, contraDirection))
	}
}

func (board *WaveImage) isPointOnBoard(point image.Point) bool {
	if point.X < board.size.Min.X || point.X > board.size.Max.X || point.Y < board.size.Min.Y || point.Y > board.size.Max.Y {
		return false
	}
	return true
}

func (w *WaveImage) CreateRandomPoint() image.Point {
	xVal := rand.Intn((w.size.Max.X - w.size.Min.X) + w.size.Min.X)
	yVal := rand.Intn((w.size.Max.Y - w.size.Min.Y) + w.size.Min.X)

	return image.Point{xVal, yVal}
}

// Collapse a pixel at the given coordinates
func (board *WaveImage) CollapsePixel(point image.Point) {

	if !board.isPointOnBoard(point) {
		return
	}

	pixel, ok := board.canvas[point]

	//The pixel is not yet in the canvas => we need to initialize it
	if !ok {
		pix := createPixel(point)
		pixel = &pix
	}

	//Restrict possibilities of this pixels color by its collapsed neighbours
	board.restrictPixelByNeighbour(board.ajacentPixelsDirections.Up, board.ajacentPixelsDirections.Down, pixel, point)
	board.restrictPixelByNeighbour(board.ajacentPixelsDirections.UpRight, board.ajacentPixelsDirections.DownLeft, pixel, point)
	board.restrictPixelByNeighbour(board.ajacentPixelsDirections.UpLeft, board.ajacentPixelsDirections.DownRight, pixel, point)
	board.restrictPixelByNeighbour(board.ajacentPixelsDirections.Left, board.ajacentPixelsDirections.Right, pixel, point)
	board.restrictPixelByNeighbour(board.ajacentPixelsDirections.Right, board.ajacentPixelsDirections.Left, pixel, point)
	board.restrictPixelByNeighbour(board.ajacentPixelsDirections.Up, board.ajacentPixelsDirections.Down, pixel, point)
	board.restrictPixelByNeighbour(board.ajacentPixelsDirections.Down, board.ajacentPixelsDirections.Up, pixel, point)
	board.restrictPixelByNeighbour(board.ajacentPixelsDirections.DownLeft, board.ajacentPixelsDirections.UpRight, pixel, point)
	board.restrictPixelByNeighbour(board.ajacentPixelsDirections.DownRight, board.ajacentPixelsDirections.UpLeft, pixel, point)

	pixelColor := board.rules.GetRandomColorNotRestricted(pixel.restrictedColors)
	pixel.isCollapsed = true
	pixel.color = pixelColor

	board.CollapseQueue.Enqueue(board.ajacentPixelsDirections.Up.Add(point))
	board.CollapseQueue.Enqueue(board.ajacentPixelsDirections.UpRight.Add(point))
	board.CollapseQueue.Enqueue(board.ajacentPixelsDirections.UpLeft.Add(point))
	board.CollapseQueue.Enqueue(board.ajacentPixelsDirections.Left.Add(point))
	board.CollapseQueue.Enqueue(board.ajacentPixelsDirections.Right.Add(point))
	board.CollapseQueue.Enqueue(board.ajacentPixelsDirections.Down.Add(point))
	board.CollapseQueue.Enqueue(board.ajacentPixelsDirections.DownLeft.Add(point))
	board.CollapseQueue.Enqueue(board.ajacentPixelsDirections.DownRight.Add(point))
}

func (w *WaveImage) ColorModel() color.Model {
	return color.RGBAModel
}
func (w *WaveImage) Bounds() image.Rectangle {
	return w.size
}
func (w *WaveImage) At(x, y int) color.Color {
	// Check if the given (x, y) coordinate is within the bounds of the image.
	if !(image.Point{x, y}.In(w.size)) {
		return color.RGBA{} // Return a default color if out of bounds.
	}

	elem := w.canvas[image.Point{x, y}]
	return elem.color
}
