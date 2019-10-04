export interface Tree<T> {
  leaves: number
  branches: number
  root: Branch<T>
}

export interface Branch<T> {
  score: number
  left: Branch<T> | Leaf<T>
  right: Branch<T> | Leaf<T>
}

export interface Leaf<T> {
  score: number
  value: T
}

export function isBranch<T>(branchOrLeaf: Branch<T> | Leaf<T>): branchOrLeaf is Branch<T> {
  if ((branchOrLeaf as any).left) {
    return true
  } else {
    return false
  }
}
