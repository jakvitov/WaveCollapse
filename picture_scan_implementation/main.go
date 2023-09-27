package main

import (
	"fmt"
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/canvas"
	"image"
	_ "image/png"
	"os"
	"picture_scan_implementation/generation"
	"picture_scan_implementation/structures"
	"time"
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

	genImgSize := image.Rectangle{Min: image.Point{0, 0}, Max: image.Point{X: 400, Y: 400}}

	timestampStart := time.Now().Unix()
	fmt.Println("Generation started.")

	genImg := generation.GenerateImage(rules, genImgSize)
	timestampEnd := time.Now().Unix()
	fmt.Printf("Generation ened. Duration: [%v] s.\n", (timestampEnd - timestampStart))
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
