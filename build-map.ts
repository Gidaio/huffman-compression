import { Branch, Leaf, Tree, isBranch } from "./huffman-types"


export function buildMap<T>(input: T[]): Tree<T> {
  const uniqueInputs = new Set(input)
  const treePieces: Array<Branch<T> | Leaf<T>> = []

  for (const uniqueItem of uniqueInputs) {
    const uniqueItemCount = input.reduce((total, item) => item === uniqueItem ? total + 1 : total, 0)
    treePieces.push({
      score: uniqueItemCount,
      value: uniqueItem
    })
  }

  const leaves = treePieces.length
  let branches = 0

  while (treePieces.length > 1) {
    treePieces.sort((a, b) => b.score - a.score)
    const left = treePieces.pop()!
    const right = treePieces.pop()!
    treePieces.push({
      score: left.score + right.score,
      left,
      right
    })

    branches++
  }

  if (isBranch(treePieces[0])) {
    return {
      leaves,
      branches,
      root: treePieces[0] as Branch<T>
    }
  } else {
    throw new Error("Something went wrong.")
  }
}
