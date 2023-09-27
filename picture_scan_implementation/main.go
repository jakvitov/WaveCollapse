package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	"image/png"
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

func displayImage(m image.Image) {
	var buf bytes.Buffer
	err := png.Encode(&buf, m)
	if err != nil {
		panic(err)
	}
	fmt.Println("IMAGE:" + base64.StdEncoding.EncodeToString(buf.Bytes()))
}

func main() {

	img := openImage(os.Args[1])
	rules := structures.CreateRulesFromImage(&img)

	genImgSize := image.Rectangle{Min: image.Point{0, 0}, Max: image.Point{X: 100, Y: 100}}
	genImg := generation.GenerateImage(rules, genImgSize)
	fmt.Println(rules)
	fmt.Println(img.Bounds())
	displayImage(genImg)
}
