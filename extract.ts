import { isBranch } from "./types"
import { readFileSync } from "fs"
import { BitBuffer } from "./bit-buffer"
import { deserializeMap } from "./deserialize-map"

const filename = "lorem-ipsum.txt" // process.argv[2]
const treeBuffer = readFileSync(`${filename}.map`)
const huffmanTree = deserializeMap(new BitBuffer(treeBuffer)).root
const binary = readFileSync(`${filename}.cmprsd`)
const bitBuffer = new BitBuffer(binary)

const lengthMSB = bitBuffer.readBits(8)
const lengthLSB = bitBuffer.readBits(8)
const length = (lengthMSB << 8) | lengthLSB

let charactersProcessed = 0
let currentBranch = huffmanTree

let out = ""

while (charactersProcessed < length) {
  const bit = bitBuffer.readBit()

  switch (bit) {
    case 0:
      if (isBranch(currentBranch.left)) {
        currentBranch = currentBranch.left
      } else {
        out += currentBranch.left.value
        currentBranch = huffmanTree
        charactersProcessed++
      }

      break

    case 1:
      if (isBranch(currentBranch.right)) {
        currentBranch = currentBranch.right
      } else {
        out += currentBranch.right.value
        currentBranch = huffmanTree
        charactersProcessed++
      }

      break
  }
}

console.log(out)
