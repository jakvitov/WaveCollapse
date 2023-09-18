# Wave function collapse - trivial implementation

This project features the most trivial implementation of wave function collapse for image generation given basic tiles and a set of rules.

![Example of render](https://github.com/jakvitov/wave_collapse/blob/main/frames/wave_collapse_trivial_example.png)

## Algorithm

### About
The algorithm is inspired by collapse of a wave function in quantum mechanics. We start by dividing the board to individual tile. Each tile can (in our case) end up as one of the 4 tile types. Until his position in decided (collapsed wave function) we consider him to be in all possible states. The states can be "measured" by what we refer to as *entropy*. Higher the entropy means, that the more states we have. (and vice versa). In this implementation, we measure the entropy as number of different states, the wave function of a tile is in. We start the algorithm by collapsing one tile.

### Collapse implementation
The collapse is basically restricting tiles state to only the ones allowed by the rules.
We take all the surrounding collapsed tiles and remove from the current one all conflicting possibilities (the lines must connect etc.). If we have 0 states left -> we have a collision (this cannot happed due to rules selection in this trivial impl). We randomly chose the tile type from the remaining states.

After a tile has collapsed we call the collapse function recursively to all its neighbours. The recursion is ended, when we reach outside of the canvas.

## Triviality
I refer to this implemention as trivial. It was a way for me, to get to know the algorithm and implement it in a simple and (at least for me) understandable way. There is much space for optimalisation and expansion and I'm looking forward to implementing them in my future projects!

## Possible extensions and optimalisations

- Give the algo a picture and let it figure out the tiles and rules
- Implement collision handling (would be needed in custom tiles project), can be simple restart or backtracking
- Optimalise next tile to collapse to be chosen optimally. For example the one with lowest entrop