package structures

import (
	"fmt"
	"image"
	"image/color"
)

var adjPoints *AdjPointDirect = GetAdjacentPoints()

// Maps direction with all the possible neighbours in it
type Rule struct {
	//Point is a representation of direction here
	directionRule map[Direction]*Set[color.Color]
}

func createRule() *Rule {
	return &Rule{}
}

func (rule *Rule) fillDirection(img *image.Image, point image.Point, dir Direction) {

	//Given point is outside of the given picture
	if !isPointInPicture(point, (*img).Bounds()) {
		return
	}

	if rule.directionRule == nil {
		rule.directionRule = make(map[Direction]*Set[color.Color])
	}

	colors := rule.directionRule[dir]

	//The set is not initialized yet -> we create it
	if colors == nil {
		//fmt.Println("Creating new colors set.")
		colors = CreateSet[color.Color]()
		rule.directionRule[dir] = colors
	}

	colors.Add((*img).At(point.X, point.Y))
}

// Create new rule for
func (rule *Rule) fillRule(img *image.Image, point image.Point) {
	UpPoint := adjPoints.Up.Add(point)
	UpRightPoint := adjPoints.UpRight.Add(point)
	UpLeftPoint := adjPoints.UpLeft.Add(point)
	LeftPoint := adjPoints.Left.Add(point)
	RightPoint := adjPoints.Right.Add(point)
	DownPoint := adjPoints.Down.Add(point)
	DownRightPoint := adjPoints.DownRight.Add(point)
	DownLeftPoint := adjPoints.DownLeft.Add(point)

	rule.fillDirection(img, UpPoint, adjPoints.Up)
	rule.fillDirection(img, UpRightPoint, adjPoints.UpRight)
	rule.fillDirection(img, UpLeftPoint, adjPoints.UpLeft)
	rule.fillDirection(img, LeftPoint, adjPoints.Left)
	rule.fillDirection(img, RightPoint, adjPoints.Right)
	rule.fillDirection(img, DownPoint, adjPoints.Down)
	rule.fillDirection(img, DownLeftPoint, adjPoints.DownLeft)
	rule.fillDirection(img, DownRightPoint, adjPoints.DownRight)

}

// Maps a color to all possible directions and neighbours in them
type Rules struct {
	colors map[color.Color]*Rule
}

func (r *Rules) String() string {
	return fmt.Sprintf("Rules: %v colors.", len((*r).colors))
}

// Create rules from an existing image
func CreateRulesFromImage(img *image.Image) *Rules {
	rules := &Rules{}
	rules.colors = make(map[color.Color]*Rule)
	rect := (*img).Bounds()

	//We iterate over the image
	for x := 0; x < rect.Max.X; x++ {
		for y := 0; y < rect.Max.Y; y++ {
			// Check if image is in the rules
			col := (*img).At(x, y)
			colRule := rules.colors[col]

			//The rule pointer is nil, we need to create the given rule
			if colRule == nil {
				colRule = createRule()
				rules.colors[col] = colRule
			}

			colRule.fillRule(img, image.Point{x, y})
		}
	}
	return rules
}
