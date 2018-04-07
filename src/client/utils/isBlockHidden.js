export default ({ map, position, chunkSize }) => {
  const [x, y, z] = position.map((n) => Number(n))

  let blockHidden = true

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      for (let k = -1; k < 2; k++) {
        const xPos = x + i
        const zPos = z + j
        const yPos = y + k

        if (yPos > 0 && xPos < chunkSize && xPos > 0 && zPos < chunkSize && zPos > 0) {
          if (!(map[xPos] && map[xPos][zPos] && map[xPos][zPos][yPos])) {
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
