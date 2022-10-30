export const setData = (data: string, entry: string, value: boolean | string | number): string => {
  let parsedData = JSON.parse(data);
  parsedData.forEach(record => record[entry] = value)
  return JSON.stringify(parsedData)
}