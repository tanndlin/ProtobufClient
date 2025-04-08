import { ValueType } from './types';
type Keywords = 'message';

type LexerTokenType =
    | Keywords
    | 'identifier'
    | '='
    | ';'
    | ValueType
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

        const keywords = new Set([
            'message',
            'enum',
            'service',
            'rpc',
            'syntax',
        ]); // Add more keywords as needed
        const type = keywords.has(identifier) ? identifier : 'identifier';
        return new LexerToken(type as LexerTokenType, identifier);
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
            } else if (/\d/.test(char)) {
                const numberToken = this.parseNumber(this.script, index);
                tokens.push(numberToken);
                index += numberToken.value.length;

                // Check if the next character is a semicolon and add it as a separate token
                if (index < this.script.length && this.script[index] === ';') {
                    tokens.push(new LexerToken(';', ';'));
                    index++;
                }
            } else if (/[a-zA-Z_]/.test(char)) {
                const identifierToken = this.parseIdentifierOrKeyword(
                    this.script,
                    index,
                );
                tokens.push(identifierToken);
                index += identifierToken.value.length;
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
