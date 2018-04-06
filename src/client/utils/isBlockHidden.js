export default ({ map, position }) => {
  const [y, x, z] = position.map((n) => Number(n))

  let blockHidden = true

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      for (let k = -1; k < 2; k++) {
        const yPos = y + i
        const xPos = x + j
        const zPos = z + k

        if (yPos > 0 && xPos < 16 && xPos > 0 && zPos < 16 && zPos > 0) {
          if (!(map[yPos] && map[yPos][xPos] && map[yPos][xPos][zPos])) {
            blockHidden = false
          }
        }
      }
    }

    // if (!(map[y + i] || y === 0)) {
    //   blockHidden = false
    // }
  }

  return blockHidden
}
