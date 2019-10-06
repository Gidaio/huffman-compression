import { Branch, isBranch } from "./types"
import { readFileSync, writeFileSync } from "fs"
import { buildMap } from "./build-map"
import { serializeMap } from "./serialize-map"
import { BitBuffer } from "./bit-buffer"

const filename = process.argv[2]

const fileContents = readFileSync(`${filename}`, "utf8")
const fileCharacters = fileContents.split("")
const huffmanTree = buildMap(fileCharacters)
const conversionTable: { [character: string]: { data: number, bitCount: number } } = {}
buildConversionTable(huffmanTree.root)

const mapBitsNeeded = huffmanTree.branches + huffmanTree.leaves * 9
const contentBitsNeeded = fileCharacters.reduce((total, char) => total + conversionTable[char].bitCount, 0)
const totalBitsNeeded = mapBitsNeeded + contentBitsNeeded + 16 // Add 16 for length.

const outBuffer = Buffer.alloc(Math.ceil(totalBitsNeeded / 8))
const outBitBuffer = new BitBuffer(outBuffer)
serializeMap(outBitBuffer, huffmanTree)

const lengthMSB = (fileContents.length & 255 << 8) >> 8
const lengthLSB = fileContents.length & 255
outBitBuffer.writeBits(lengthMSB, 8)
outBitBuffer.writeBits(lengthLSB, 8)

for (const character of fileCharacters) {
  const tableEntry = conversionTable[character]
  outBitBuffer.writeBits(tableEntry.data, tableEntry.bitCount)
}

outBitBuffer.flush()
writeFileSync(`${filename}.hc`, outBuffer)


function buildConversionTable(currentBranch: Branch<string>, currentData = 0, currentBitCount = 0) {
  if (isBranch(currentBranch.left)) {
    buildConversionTable(currentBranch.left, currentData << 1, currentBitCount + 1)
  } else {
    conversionTable[currentBranch.left.value] = {
      data: currentData << 1,
      bitCount: currentBitCount + 1
    }
  }

  if (isBranch(currentBranch.right)) {
    buildConversionTable(currentBranch.right, currentData << 1 | 1, currentBitCount + 1)
  } else {
    conversionTable[currentBranch.right.value] = {
      data: currentData << 1 | 1,
      bitCount: currentBitCount + 1
    }
  }
}
