export function stringifyBuffer(buffer: Buffer): string {
  let bufParts = []
  for (const num of buffer) {
    bufParts.push(num.toString(2).padStart(8, "0"))
  }

  return bufParts.join(" ")
}
