import { ValueType } from './types';

class ProtoMessageType<T> {
    constructor(
        public name: string,
        public fields: Record<keyof T & string, ValueType>,
    ) {}

    public GenerateTypeScript(): string {
        return `export interface ${this.name} {\n${Object.entries(this.fields)
            .map(([key, value]) => `    ${key}: ${value};`)
            .join('\n')}\n}`;
    }
}

export default ProtoMessageType;
