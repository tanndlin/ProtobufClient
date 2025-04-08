export function decodeVarint(buffer: Buffer, offset: number) {
    const bytes = [];
    while (offset < buffer.length) {
        const byte = buffer[offset++];
        const msb = byte & 0x80;
        if (msb === 0) {
            bytes.push(byte);
            break;
        }
        bytes.push(byte & 0x7f);
    }

    let value = 0;
    const bigEndian = bytes.reverse();
    // Concat the bits into a single number
    for (let i = 0; i < bigEndian.length; i++) {
        value |= (bigEndian[i] & 0x7f) << (7 * (bigEndian.length - 1 - i));
    }

    return { value, offset };
}
