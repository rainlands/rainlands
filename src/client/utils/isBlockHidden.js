export default ({ map, position }) => {
  const [y, x, z] = position.map((n) => Number(n))

  let blockHidden = true

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      for (let k = -1; k < 2; k++) {
        if (!(map[y + i] && map[y + i][x + j] && map[y + i][x + j][z + k])) {
          blockHidden = false
        }
      }
    }
  }

  return blockHidden
}
