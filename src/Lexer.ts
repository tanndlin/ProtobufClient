import { isKeyword, isValueType } from './utils';

export const keywords = ['message', 'optional'] as const;
export type KeywordType = (typeof keywords)[number];

type LexerTokenType =
    | 'message'
    | 'modifier'
    | 'identifier'
    | '='
    | ';'
    | 'type'
    | '{'
    | '}'
    | 'number';

export default LexerTokenType;

class LexerToken {
    type: LexerTokenType;
    value: string;

    constructor(type: LexerTokenType, value: string) {
        this.type = type;
        this.value = value;
    }
}

class Lexer {
    private script: string;

    constructor(script: string) {
        this.script = script;
    }

    private parseNumber(input: string, index: number): LexerToken {
        let number = '';
        while (index < input.length && /\d/.test(input[index])) {
            number += input[index++];
        }

        return new LexerToken('number', number);
    }

    private parseIdentifierOrKeyword(input: string, index: number): LexerToken {
        let identifier = '';
        while (index < input.length && /[a-zA-Z0-9_]/.test(input[index])) {
            identifier += input[index];
            index++;
        }

        if (isKeyword(identifier)) {
            return this.handleKeyword(identifier);
        } else if (isValueType(identifier)) {
            return new LexerToken('type', identifier);
        }

        return new LexerToken('identifier', identifier);
    }

    private handleKeyword(identifier: string): LexerToken {
        if (identifier === 'message') {
            return new LexerToken('message', identifier);
        } else if (identifier === 'optional') {
            return new LexerToken('modifier', identifier);
        } else if (isValueType(identifier)) {
            return new LexerToken('type', identifier);
        }

        return new LexerToken('identifier', identifier);
    }

    public tokenize(): LexerToken[] {
        const tokens: LexerToken[] = [];
        let index = 0;

        while (index < this.script.length) {
            const char = this.script[index];

            if (char.trim() === '') {
                index++;
                continue;
            }

            if (char === '{' || char === '}' || char === '=' || char === ';') {
                tokens.push(new LexerToken(char as LexerTokenType, char));
                index++;
            } else if (/[a-zA-Z_]/.test(char)) {
                const identifierToken = this.parseIdentifierOrKeyword(
                    this.script,
                    index,
                );
                tokens.push(identifierToken);
                index += identifierToken.value.length;
            } else if (/\d/.test(char)) {
                const numberToken = this.parseNumber(this.script, index);
                tokens.push(numberToken);
                index += numberToken.value.length;
            } else {
                console.error(
                    `Unexpected character encountered: '${char}' at index ${index}`,
                );
                throw new Error(`Unexpected character: ${char}`);
            }
        }

        return tokens;
    }
}

export { Lexer, LexerToken };
