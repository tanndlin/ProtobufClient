import { LexerToken } from './Lexer';
import ProtoMessageType from './ProtoMessageType';
import { ProtoField, ValueType } from './types';
import { isValueType } from './utils';

class Parser {
    private tokens: LexerToken[];
    private currentTokenIndex: number;

    constructor(tokens: LexerToken[]) {
        this.tokens = tokens;
        this.currentTokenIndex = 0;
    }

    private getCurrentToken(): LexerToken | null {
        return this.currentTokenIndex < this.tokens.length
            ? this.tokens[this.currentTokenIndex]
            : null;
    }

    private advance(): void {
        this.currentTokenIndex++;
    }

    private expectToken(expectedType: string): void {
        const token = this.getCurrentToken();
        if (!token || token.type !== expectedType) {
            throw new Error(
                `Expected token of type '${expectedType}', but got '${token?.type || 'null'}',`,
            );
        }
        this.advance();
    }

    private parseMessage(): ProtoMessageType<any> {
        const fieldNames = new Set<string>();
        const fieldNumbers = new Set<number>();

        const messageName = this.getCurrentToken()?.value;
        if (!messageName) {
            throw new Error('Expected message name');
        }

        this.advance();
        this.expectToken('{');

        const fields: Record<string, ProtoField> = {};

        while (this.getCurrentToken()?.type !== '}') {
            if (!this.getCurrentToken()) {
                throw new Error('Unexpected end of input while parsing fields');
            }
            const field = this.parseField(fieldNames, fieldNumbers);
            fields[field.name] = field;
        }

        this.expectToken('}');
        return new ProtoMessageType<any>(messageName, fields);
    }

    private parseField(
        fieldNames: Set<string>,
        fieldNumbers: Set<number>,
    ): ProtoField {
        const nextToken = this.getCurrentToken();
        if (!nextToken) {
            throw new Error('Expected field declaration');
        }

        const optional =
            nextToken.type === 'modifier' && nextToken.value === 'optional';

        const fieldType = optional
            ? this.getCurrentToken()?.value
            : nextToken.value;
        if (!fieldType) {
            throw new Error('Expected field type');
        }
        this.advance();

        if (!isValueType(fieldType)) {
            throw new Error(`Invalid field type: ${fieldType}`);
        }

        const fieldName = this.getCurrentToken()?.value;
        if (!fieldName) {
            throw new Error('Expected field name');
        }
        if (fieldNames.has(fieldName)) {
            throw new Error(`Duplicate field name: ${fieldName}`);
        }
        fieldNames.add(fieldName);
        this.advance();

        let fieldNumber: number | undefined;
        if (this.getCurrentToken()?.type === '=') {
            this.advance();
            fieldNumber = parseInt(this.getCurrentToken()?.value || '', 10);
            if (isNaN(fieldNumber)) {
                throw new Error('Expected a valid field number');
            }
            if (fieldNumbers.has(fieldNumber)) {
                throw new Error(`Duplicate field number: ${fieldNumber}`);
            }
            fieldNumbers.add(fieldNumber);
            this.advance();
        } else {
            throw new Error('Expected = after field name');
        }

        if (this.getCurrentToken()?.type === ';') {
            this.advance();
        } else {
            throw new Error('Expected ; at the end of field declaration');
        }

        return {
            name: fieldName,
            type: fieldType as ValueType,
            id: fieldNumber,
            optional: false,
        };
    }

    public parse(): ProtoMessageType<any> {
        while (this.getCurrentToken()) {
            const token = this.getCurrentToken();

            if (token?.type === 'message') {
                this.advance();
                const message = this.parseMessage();

                if (this.getCurrentToken()) {
                    throw new Error(
                        'Unexpected tokens after message declaration',
                    );
                }

                return message;
            } else {
                throw new Error(`Unexpected token: ${token?.type}`);
            }
        }

        throw new Error('No message found');
    }
}

export default Parser;
