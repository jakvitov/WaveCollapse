package structures

import "image"

// This struct represents a whole image, that is being created using the wave collapse
type WaveImage struct {
	canvas map[image.Point]*Pixel

	collapseQueue *Queue[image.Point]

	rules *Rules

	ajacentPixelsDirections *AdjPointDirect
}

func createWaveImage() *WaveImage {
	result := &WaveImage{}
	//We do not initialize all of the image pixels right away, they get added, as we generate for efficiency
	result.canvas = make(map[image.Point]*Pixel)
	result.collapseQueue = CreateQueue[image.Point]()
	result.ajacentPixelsDirections = GetAdjacentPoints()
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

// Collapse a pixel at the given coordinates
func (board *WaveImage) CollapsePixel(point image.Point) {

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
	pixelColor = pixelColor

	board.collapseQueue.Enqueue(board.ajacentPixelsDirections.Up.Add(point))
	board.collapseQueue.Enqueue(board.ajacentPixelsDirections.UpRight.Add(point))
	board.collapseQueue.Enqueue(board.ajacentPixelsDirections.UpLeft.Add(point))
	board.collapseQueue.Enqueue(board.ajacentPixelsDirections.Left.Add(point))
	board.collapseQueue.Enqueue(board.ajacentPixelsDirections.Right.Add(point))
	board.collapseQueue.Enqueue(board.ajacentPixelsDirections.Down.Add(point))
	board.collapseQueue.Enqueue(board.ajacentPixelsDirections.DownLeft.Add(point))
	board.collapseQueue.Enqueue(board.ajacentPixelsDirections.DownRight.Add(point))

}
