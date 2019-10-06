import { Branch, isBranch } from "./types"
import { readFileSync, writeFileSync } from "fs"
import { buildMap } from "./build-map"
import { serializeMap } from "./serialize-map"
import { BitBuffer } from "./bit-buffer"
// import * as path from "path"

const filename = "lorem-ipsum.txt" //process.argv[2]

const fileContents = readFileSync(`${filename}`, "utf8")
const fileCharacters = fileContents.split("")
const huffmanTree = buildMap(fileCharacters)

const mapBitsNeeded = huffmanTree.branches + huffmanTree.leaves * 9
const mapBuffer = Buffer.alloc(Math.ceil(mapBitsNeeded / 8))
serializeMap(new BitBuffer(mapBuffer), huffmanTree)
writeFileSync(`${filename}.map`, mapBuffer)

const conversionTable: { [character: string]: { data: number, bitCount: number } } = {}
buildConversionTable(huffmanTree.root)

const contentBitsNeeded = fileCharacters.reduce((total, char) => total + conversionTable[char].bitCount, 0)

const contentBuffer = Buffer.alloc(Math.ceil(contentBitsNeeded / 8) + 2)
const bitBuffer = new BitBuffer(contentBuffer)
const lengthMSB = (fileContents.length & 255 << 8) >> 8
const lengthLSB = fileContents.length & 255
bitBuffer.writeBits(lengthMSB, 8)
bitBuffer.writeBits(lengthLSB, 8)

for (const character of fileCharacters) {
  const tableEntry = conversionTable[character]
  bitBuffer.writeBits(tableEntry.data, tableEntry.bitCount)
}

writeFileSync(`${filename}.cmprsd`, contentBuffer)


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
