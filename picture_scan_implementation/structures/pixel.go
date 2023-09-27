package structures

import (
	"image"
	"image/color"
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
