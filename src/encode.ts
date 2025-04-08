export function encodeVarint(value: number): number[] {
    const buffer: number[] = [];
    while (value > 0x7f) {
        buffer.push((value & 0x7f) | 0x80);
        value >>>= 7;
    }
    buffer.push(value & 0x7f);
    return buffer;
}
