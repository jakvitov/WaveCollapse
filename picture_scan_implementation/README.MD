# Picture scanning implementation **[UNDER CONSTRUCTION]**
This is more advanced implementation of wave function collapse algorithm. The whole implementation is done in Go, which is more convinient for this low level programming, then the TypeScript I used in the 
trivial implementation. 

## Key features
- Picture scanning (we seed the app with and image and it created the ruleset from it)
- Rules include probability -> in every wave collapse we also consider distribution of different colors across the image
- Tiles are pixels -> instead of having a tiles represented by pictures, we consider each pixel (its color) as a tile



