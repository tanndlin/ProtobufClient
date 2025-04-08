import { decodeVarint } from './decode';
import { encodeFixed32, encodeFixed64, encodeVarint } from './encode';
import { ProtoField, WireType } from './types';
import { valueTypeToWireType } from './utils';

class ProtoMessageType<T> {
    constructor(
        public name: string,
        public fields: ProtoField<T>[],
    ) {}

    public GenerateTypeScript(): string {
        return `export interface ${this.name} {\n${Object.entries(this.fields)
            .map(([key, value]) => `    ${key}: ${value};`)
            .join('\n')}\n}`;
    }

    public decode(buffer: Buffer): T {
        const result: Partial<T> = {};
        let offset = 0;

        while (offset < buffer.length) {
            offset = this.decodeField(result, buffer, offset);
        }

        return result as T;
    }

    private decodeField(result: Partial<T>, buffer: Buffer, offset: number) {
        const fieldNumber = buffer[offset] >> 3;
        const wireType = (buffer[offset++] & 0x07) as WireType;
        const field = this.fields.find((f) => f.id === fieldNumber);
        if (!field) {
            throw new Error(`Unknown field id (id: ${fieldNumber}`);
        }

        const expectedWireType = valueTypeToWireType(field.type) as WireType;
        if (expectedWireType !== wireType) {
            throw new Error(
                `Decoded wire type (${wireType}) did not match (expected: ${expectedWireType})`,
            );
        }

        switch (wireType) {
            case WireType.Varint:
                const { offset: newOffset, value } = decodeVarint(
                    buffer,
                    offset,
                    field.type,
                );
                offset = newOffset;
                const coerced = (
                    field.type === 'bool' ? value > 0 : value
                ) as T[keyof T & string];
                result[field.name] = coerced;
                break;
            default:
                throw new Error(
                    `Attempt to decode unimplemented wire type (type: ${field.type})`,
                );
        }

        return offset;
    }

    public encode(data: T): Buffer {
        const buffer: number[] = [];

        for (const field of this.fields) {
            const value = data[field.name as keyof T];

            buffer.push(...this.encodeField(field, value));
        }

        return Buffer.from(buffer);
    }

    private encodeField(field: ProtoField<T>, value: T[keyof T]): number[] {
        const buffer: number[] = [];
        const wireType = valueTypeToWireType(field.type);
        buffer.push((field.id << 3) | wireType);

        switch (wireType) {
            case WireType.Varint:
                buffer.push(...encodeVarint(value as number, field.type));
                break;
            case WireType.Fixed64:
                buffer.push(...encodeFixed64(value as number, field.type));
                break;
            case WireType.Fixed32:
                buffer.push(...encodeFixed32(value as number, field.type));
                break;
            default:
                throw new Error(
                    `Attempt to encode unimplemented wire type (type: ${field.type})`,
                );
        }

        return buffer;
    }
}

export default ProtoMessageType;
