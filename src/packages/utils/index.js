export const mapObject = (object, func) => {
  const keys = Object.keys(object)
  const values = Object.values(object).map((value, index) => func(keys[index], value, index))

  return values.reduce(
    (acc, cur, i) => ({
      ...acc,
      [keys[i]]: cur,
    }),
    {}
  )
}
