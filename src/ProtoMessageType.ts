import { ProtoField } from './types';

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
        // Example encoding logic (to be replaced with actual implementation)
        const jsonString = JSON.stringify(data);
        return Buffer.from(jsonString, 'utf-8');
    }
}

export default ProtoMessageType;
