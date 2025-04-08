import { encodeVarint } from './encode';
import { ProtoField, WireType } from './types';
import { valueTypeToWireType } from './utils';

class ProtoMessageType<T> {
    constructor(
        public name: string,
        public fields: Record<keyof T & string, ProtoField>,
    ) {}

    public GenerateTypeScript(): string {
        return `export interface ${this.name} {\n${Object.entries(this.fields)
            .map(([key, value]) => `    ${key}: ${value};`)
            .join('\n')}\n}`;
    }

    public encode(data: T): Buffer {
        const buffer: number[] = [];

        for (const key of Object.keys(this.fields)) {
            const field = this.fields[key as keyof T & string];
            const value = data[key as keyof T & string];

            buffer.push(...this.encodeField(field, value));
        }

        return Buffer.from(buffer);
    }

    private encodeField(field: ProtoField, value: T[keyof T]): number[] {
        const buffer: number[] = [];
        const wireType = valueTypeToWireType(field.type);
        buffer.push((field.id << 3) | wireType);

        switch (wireType) {
            case WireType.Varint: // Varint
                buffer.push(...encodeVarint(value as number));
                break;
        }

        return buffer;
    }
}

export default ProtoMessageType;
