package structures

import "image"

type Direction image.Point

// Direction we take as a point, that when added gives us +1 in the given Direction
// For example Direction UP {0, 1} + {3, 5} -> {3, 6}, which is up one tile over {3,5}
type AdjPointDirect struct {
	Up        Direction
	UpLeft    Direction
	UpRight   Direction
	Left      Direction
	Right     Direction
	Down      Direction
	DownLeft  Direction
	DownRight Direction
}

// Returns a pointer to a constant structure of neighbouring points
func GetAdjacentPoints() *AdjPointDirect {
	result := AdjPointDirect{
		Up:        Direction{0, 1},
		UpLeft:    Direction{-1, 1},
		UpRight:   Direction{1, 1},
		Left:      Direction{-1, 0},
		Right:     Direction{1, 0},
		Down:      Direction{0, -1},
		DownLeft:  Direction{-1, -1},
		DownRight: Direction{1, -1},
	}
	return &result
}

// Return if the given point is in the given picture
func isPointInPicture(point image.Point, bounds image.Rectangle) bool {
	if point.X >= 0 && point.X <= bounds.Max.X && point.Y >= 0 && point.Y <= bounds.Max.Y {
		return true
	}
	return false
}

func (dir Direction) Add(dir2 image.Point) image.Point {
	return image.Point{dir.X + dir2.X, dir.Y + dir2.Y}
}
