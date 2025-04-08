export function parseVarint(buffer: Buffer): number {
    const bytes = [];
    while (buffer.length > 0) {
        const byte = buffer[0];
        const msb = byte & 0x80;
        if (msb === 0) {
            bytes.push(byte);
            break;
        }
        bytes.push(byte & 0x7f);
        buffer = buffer.slice(1);
    }

    let value = 0;
    const bigEndian = bytes.reverse();
    // Concat the bits into a single number
    for (let i = 0; i < bigEndian.length; i++) {
        value |= (bigEndian[i] & 0x7f) << (7 * (bigEndian.length - 1 - i));
    }

    return value;
}
