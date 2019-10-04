export class BitBuffer {
  private buffer: Buffer
  private bytePointer = 0
  private bitPointer = 0
  private byteBuffer = 0

  public get capacity(): number {
    return this.buffer.length * 8
  }

  public constructor(buffer: Buffer) {
    this.buffer = buffer
    this.byteBuffer = this.buffer[0]
  }

  public setLocation(location: number): void {
    if (location >= this.buffer.length * 8) {
      throw new Error("The buffer isn't that long.")
    }

    this.bytePointer = Math.floor(location / 8)
    this.bitPointer = location % 8
    this.byteBuffer = this.buffer[this.bytePointer]
  }

  public getLocation(): number {
    return this.byteBuffer * 8 + this.bitPointer
  }

  public readBit(): 0 | 1 {
    if (this.bitPointer > 7) {
      this.bytePointer++
      if (this.bytePointer >= this.buffer.length) {
        throw new Error("Out of bounds!")
      }
      this.byteBuffer = this.buffer[this.bytePointer]
      this.bitPointer = 0
    }

    const mask = 0x80 >> this.bitPointer
    const shiftAmount = 7 - this.bitPointer
    const bit = (this.byteBuffer & mask) >> shiftAmount
    this.bitPointer++

    return bit as 0 | 1
  }

  public readBits(numberOfBits: number): number {
    let out = 0
    for (let i = 0; i < numberOfBits; i++) {
      out <<= 1
      out |= this.readBit()
    }

    return out
  }

  public writeBit(bit: 0 | 1): void {
    if (this.bitPointer > 7) {
      this.flush()
    }
    if (this.bytePointer >= this.buffer.length) {
      throw new Error("Out of bounds!")
    }

    const shiftAmount = 7 - this.bitPointer++
    const clearMask = 0xff ^ 1 << shiftAmount
    this.byteBuffer &= clearMask
    this.byteBuffer |= bit << shiftAmount
  }

  public writeBits(data: number, numberOfBits: number): void {
    for (let i = numberOfBits - 1; i >= 0; i--) {
      const mask = 1 << i
      const bit = (data & mask) >> i
      this.writeBit(bit as 0 | 1)
    }
  }

  public flush(): void {
    this.buffer[this.bytePointer++] = this.byteBuffer
    this.byteBuffer = this.buffer[this.bytePointer]
    this.bitPointer = 0
  }
}

/* TESTS */
// const buffer = Buffer.alloc(3, 0xaa)
// buffer[1] = 0x55
// const bitBuffer = new BitBufferReader(buffer)

// for (let i = 0; i < 24; i++) {
//   console.log(bitBuffer.readBit())
// }

// bitBuffer.setLocation(0)
// console.log(bitBuffer.readBits(4))
// console.log(bitBuffer.readBits(8))

// const buffer = Buffer.alloc(3)
// const bitBuffer = new BitBufferReader(buffer)

// for (let i = 0; i < 24; i++) {
//   bitBuffer.writeBit((i % 2) as 0 | 1)
// }
// bitBuffer.flush()

// bitBuffer.setLocation(0)
// bitBuffer.writeBits(147, 8)
// bitBuffer.flush()

// let dummy = 0
