package structures

import (
	"image"
	"image/color"
	"math/rand"
)

// Pixel in the image, that is being generated
type Pixel struct {
	restrictedColors *Set[color.Color]
	isCollapsed      bool
	color            color.Color
}

func createPixel(position image.Point) Pixel {
	result := Pixel{}
	result.restrictedColors = CreateSet[color.Color]()
	result.isCollapsed = false
	return result
}

func CreateRandomPixel(boundaries *image.Rectangle, image2 image.Image) Pixel {
	xVal := rand.Intn((boundaries.Max.X - boundaries.Min.X) + boundaries.Min.X)
	yVal := rand.Intn((boundaries.Max.Y - boundaries.Min.Y) + boundaries.Min.X)

	return createPixel(image.Point{xVal, yVal})
}
