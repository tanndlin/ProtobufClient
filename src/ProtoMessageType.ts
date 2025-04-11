import { decodeVarint } from './decode';
import { encodeRepeated, encodeValue } from './encode';
import { ProtoField, WireType } from './types';
import { valueTypeToWireType } from './utils';

class ProtoMessageType<T extends { [key: string]: T[keyof T] }> {
    constructor(
        public name: string,
        public fields: ProtoField<T>[],
    ) {}

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

        const expectedWireType = valueTypeToWireType(field) as WireType;
        if (expectedWireType !== wireType) {
            throw new Error(
                `Decoded wire type (${wireType}) did not match (expected: ${expectedWireType})`,
            );
        }

        if (field.repeated) {
            throw new Error('Repeated fields are not supported yet');
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
            case WireType.Fixed64:
                const fixed64 = buffer.readDoubleLE(offset);
                offset += 8;
                result[field.name] = fixed64 as T[keyof T & string];
                break;
            case WireType.Fixed32:
                const fixed32 = buffer.readFloatLE(offset);
                offset += 4;
                result[field.name] = fixed32 as T[keyof T & string];
                break;
            case WireType.LengthDelimited:
                const length = decodeVarint(buffer, offset, 'uint32').value;
                offset++; // +1 for the length byte
                let str = buffer.toString('utf-8', offset, offset + length);
                result[field.name] = str as T[keyof T & string];
                offset += length;
                break;
            default:
                throw new Error(
                    `Attempt to decode unimplemented wire type (type: ${field.type})`,
                );
        }

        return offset;
    }

    public encode(data: Partial<T>): Uint8Array {
        const buffer: number[] = [];

        for (const key of Object.keys(data)) {
            const value = data[key as keyof T]!;
            const field = this.fields.find((f) => f.name === key);
            if (!field) {
                throw new Error(`Unknown field name. (key: ${key})`);
            }

            // Special case for 0. Does not need to be encoded
            if (
                valueTypeToWireType(field) === WireType.Varint &&
                value === 0 &&
                !field.optional
            ) {
                continue;
            }

            buffer.push(...this.encodeField(field, value));
        }

        return new Uint8Array(buffer);
    }

    private encodeField(field: ProtoField<T>, value: T[keyof T]): number[] {
        const buffer: number[] = [];
        const wireType = valueTypeToWireType(field);
        buffer.push((field.id << 3) | wireType);

        if (field.repeated) {
            return [...buffer, ...encodeRepeated(field, value as T[keyof T])];
        }

        return [...buffer, ...encodeValue(field, value)];
    }
}

export default ProtoMessageType;
