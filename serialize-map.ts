import { BitBuffer } from "./bit-buffer"
import { Branch, Tree, isBranch } from "./types"


export function serializeMap(bitBuffer: BitBuffer, map: Tree<string>) {
  const bitsNeeded = map.branches + map.leaves * 9
  const startLocation = bitBuffer.getLocation()
  if (bitBuffer.capacity - startLocation < bitsNeeded) {
    throw new Error("That buffer isn't big enough.")
  }

  serialize(map.root)

  function serialize(currentBranch: Branch<string>) {
    if (isBranch(currentBranch.left)) {
      bitBuffer.writeBit(0)
      serialize(currentBranch.left)
    } else {
      bitBuffer.writeBit(1)
      bitBuffer.writeBits(currentBranch.left.value.charCodeAt(0), 8)
    }

    if (isBranch(currentBranch.right)) {
      bitBuffer.writeBit(0)
      serialize(currentBranch.right)
    } else {
      bitBuffer.writeBit(1)
      bitBuffer.writeBits(currentBranch.right.value.charCodeAt(0), 8)
    }
  }
}


/* TEST STUFF */
// import { buildMap } from "./build-map"
// import { stringifyBuffer } from "./helpers"

// const testMap = buildMap("asdfasdfjkasdfldkfasdfaskdfjasdfasdfjla".split(""))

// console.log(JSON.stringify(testMap, null, 2))

// const bitsNeeded = testMap.branches + testMap.leaves * 9 + 3
// const bufferLength = Math.ceil(bitsNeeded / 8)

// const buffer = Buffer.alloc(bufferLength)
// const bitBuffer = new BitBuffer(buffer)
// serializeMap(bitBuffer, testMap)
// console.log(stringifyBuffer(buffer))
