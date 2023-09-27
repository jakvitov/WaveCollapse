package generation

import (
	"image"
	"picture_scan_implementation/structures"
)

// Given a set of rules and image size, generate the image using the wave collapse algorithm
func GenerateImage(rules *structures.Rules, size image.Rectangle) *structures.WaveImage {
	img := structures.CreateWaveImage(size, rules)
	randomPoint := img.CreateRandomPoint()

	//We collapse a random point
	img.CollapsePixel(randomPoint)

	for {
		//We break from the image processing when all pixels are collapsed and to-collapse queue is empty
		if img.CollapseQueue.IsEmpty() {
			break
		}

		img.CollapsePixel(img.CollapseQueue.Dequeue())
	}

	return img
}
