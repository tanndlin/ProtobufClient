import { Lexer } from '../src/Lexer';
import Parser from '../src/Parser';
import ProtoMessageType from '../src/ProtoMessageType';

describe('Parser', () => {
    it('should parse a simple message', () => {
        const script = `message TestMessage {
            string field1 = 1;
            int32 field2 = 2;
        }`;

        const lexer = new Lexer(script);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const result = parser.parse();

        expect(result).toBeInstanceOf(ProtoMessageType);
        expect(result.name).toBe('TestMessage');
        expect(result.fields).toEqual([
            { type: 'string', name: 'field1', id: 1, optional: false },
            { type: 'int32', name: 'field2', id: 2, optional: false },
        ]);
    });

    it('should throw an error for duplicate field names', () => {
        const script = `message TestMessage {
            string field1 = 1;
            string field1 = 2;
        }`;

        const lexer = new Lexer(script);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);

        expect(() => parser.parse()).toThrowError(
            'Duplicate field name: field1',
        );
    });

    it('should throw an error for duplicate field numbers', () => {
        const script = `message TestMessage {
            string field1 = 1;
            string field2 = 1;
        }`;

        const lexer = new Lexer(script);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);

        expect(() => parser.parse()).toThrowError('Duplicate field number: 1');
    });

    it.each([
        'message { string field1 = 1; }',
        'message TestMessage { string field1 = 1;',
        'message TestMessage { string field1 = 1; string field2 = 2;',
        'message TestMessage { string field1 = 1; } extra',
        'message TestMessage { string field1 = 1; } }',
        'message TestMessage { string field1 = 1; } extra { }',
        'message TestMessage { string field1 = 1 }',
        'message TestMessage { string  = 1; }',
        'message TestMessage { string field1 = ; }',
        'message TestMessage { field1 temp = 1; }',
    ])('should throw an error for invalid syntax: %s', (script) => {
        const lexer = new Lexer(script);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);

        expect(() => parser.parse()).toThrow();
    });
});
