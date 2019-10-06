import { isBranch } from "./types"
import { readFileSync, writeFileSync } from "fs"
import { BitBuffer } from "./bit-buffer"
import { deserializeMap } from "./deserialize-map"

const filename = process.argv[2]

const inBuffer = readFileSync(`${filename}`)
const inBitBuffer = new BitBuffer(inBuffer)
const huffmanTree = deserializeMap(inBitBuffer).root

const lengthMSB = inBitBuffer.readBits(8)
const lengthLSB = inBitBuffer.readBits(8)
const length = (lengthMSB << 8) | lengthLSB

let charactersProcessed = 0
let currentBranch = huffmanTree

let out = ""

while (charactersProcessed < length) {
  const bit = inBitBuffer.readBit()

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

writeFileSync(`${filename.replace(".hc", "")}`, out)
