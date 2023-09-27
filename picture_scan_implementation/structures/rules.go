package structures

import (
	"fmt"
	"image"
	"image/color"
	"math/rand"
)

var adjPoints *AdjPointDirect = GetAdjacentPoints()

// Maps direction with all the possible neighbours in it
// We use more maps to keep searching in given data structures fastest possible
// It's quite a memory -> speed tradeoff
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
	colors    map[color.Color]*Rule
	colorDist map[color.Color]uint64
}

func (r *Rules) String() string {
	return fmt.Sprintf("Rules: %v colors.", len((*r).colors))
}

func (r *Rules) GetRuleForDirection(col color.Color, direction Direction) *Set[color.Color] {
	rule, ok := r.colors[col]
	if !ok {
		panic(fmt.Sprintf("Color [%v] not found in rules!", col))
	}
	colorRule, ok := rule.directionRule[direction]
	if !ok {
		panic(fmt.Sprintf("Direction [%v] not found in rules for color [%v]!", direction, col))
	}
	return colorRule
}

// Return a random not restricted color
func (r *Rules) GetRandomColorNotRestricted(restrictedColors *Set[color.Color]) color.Color {
	possibleColors := RestrictMapWithSet(r.colorDist, restrictedColors)

	index := rand.Intn(len(possibleColors))
	k := 0

	for elem := range r.colorDist {
		k += 1
		if k == index {
			return elem
		}
	}
	panic("Error in finding the random selected color")
}

// Create rules from an existing image
func CreateRulesFromImage(img *image.Image) *Rules {
	rules := &Rules{}
	rules.colors = make(map[color.Color]*Rule)
	rules.colorDist = make(map[color.Color]uint64)

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

			rules.colorDist[col] += 1
			colRule.fillRule(img, image.Point{x, y})
		}
	}
	return rules
}
