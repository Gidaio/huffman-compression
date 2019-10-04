import { BitBuffer } from "./bit-buffer"
import { Tree, Branch } from "./huffman-types"


export function deserializeMap(bitBuffer: BitBuffer): Tree<string> {
  let branches = 1
  let leaves = 0

  const root = deserialize()

  return {
    leaves,
    branches,
    root
  }

  function deserialize(): Branch<string> {
    let left = null
    let right = null

    const leftType = bitBuffer.readBit()

    if (leftType === 0) {
      branches++
      left = deserialize()
    } else {
      leaves++
      const numericValue = bitBuffer.readBits(8)
      left = {
        score: 0,
        value: String.fromCharCode(numericValue)
      }
    }

    const rightType = bitBuffer.readBit()

    if (rightType === 0) {
      branches++
      right = deserialize()
    } else {
      leaves++
      const numericValue = bitBuffer.readBits(8)
      right = {
        score: 0,
        value: String.fromCharCode(numericValue)
      }
    }

    return {
      score: 0,
      left,
      right
    }
  }
}


/* TEST STUFF */

// const testBufferString = "01011001 10101100 10001011 00001010 11100110 10110101 00101101 10010110 10110000"
// const testBufferNumbers = testBufferString.split(" ")
// const testBuffer = Buffer.alloc(testBufferNumbers.length)
// for (let i = 0; i < testBufferNumbers.length; i++) {
//   testBuffer[i] = parseInt(testBufferNumbers[i], 2)
// }

// const bitBuffer = new BitBuffer(testBuffer)
// const tree = deserializeMap(bitBuffer)
// console.log(JSON.stringify(tree, null, 2))
