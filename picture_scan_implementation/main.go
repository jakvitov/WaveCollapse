package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/canvas"
	"image"
	_ "image/png"
	"os"
	"picture_scan_implementation/generation"
	"picture_scan_implementation/structures"
)

func openImage(path string) image.Image {
	infile, err := os.Open(path)

	//File opening error
	if err != nil {
		panic(err.Error())
	}
	//Schedule file closing after the main finishes
	defer infile.Close()

	src, _, opError := image.Decode(infile)

	if opError != nil {
		panic(opError.Error())
	}

	return src

}

func generateImage() *structures.WaveImage {
	img := openImage(os.Args[1])
	rules := structures.CreateRulesFromImage(&img)

	genImgSize := image.Rectangle{Min: image.Point{0, 0}, Max: image.Point{X: 640, Y: 480}}
	genImg := generation.GenerateImage(rules, genImgSize)
	return genImg
}

func main() {
	a := app.New()
	w := a.NewWindow("Images")

	img := canvas.NewImageFromImage(generateImage())
	w.SetContent(img)
	w.Resize(fyne.NewSize(640, 480))

	w.ShowAndRun()
}
