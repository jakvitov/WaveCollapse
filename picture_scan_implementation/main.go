package main

import (
	"fmt"
	"image"
	_ "image/png"
	"os"
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

func main() {

	img := openImage(os.Args[1])
	rules := structures.CreateRulesFromImage(&img)
	fmt.Println(&rules)
	fmt.Println(img.Bounds())
}
