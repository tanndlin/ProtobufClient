import { Lexer, LexerToken } from '../src/Lexer';

describe('Lexer Tests', () => {
    it('should tokenize a simple proto message', () => {
        const protoContent = `
        message ExampleMessage {
            string temp = 1;
            int32 temp2 = 2;
        }`;

        const lexer = new Lexer(protoContent);
        const tokens = lexer.tokenize();

        expect(tokens).toEqual([
            new LexerToken('message', 'message'),
            new LexerToken('identifier', 'ExampleMessage'),
            new LexerToken('{', '{'),
            new LexerToken('identifier', 'string'),
            new LexerToken('identifier', 'temp'),
            new LexerToken('=', '='),
            new LexerToken('number', '1'),
            new LexerToken(';', ';'),
            new LexerToken('identifier', 'int32'),
            new LexerToken('identifier', 'temp2'),
            new LexerToken('=', '='),
            new LexerToken('number', '2'),
            new LexerToken(';', ';'),
            new LexerToken('}', '}'),
        ]);
    });

    it('should handle extra whitespace and newlines', () => {
        const protoContent = `
        message    ExampleMessage   {

            string   temp   =   1 ;

        }`;

        const lexer = new Lexer(protoContent);
        const tokens = lexer.tokenize();

        expect(tokens).toEqual([
            new LexerToken('message', 'message'),
            new LexerToken('identifier', 'ExampleMessage'),
            new LexerToken('{', '{'),
            new LexerToken('identifier', 'string'),
            new LexerToken('identifier', 'temp'),
            new LexerToken('=', '='),
            new LexerToken('number', '1'),
            new LexerToken(';', ';'),
            new LexerToken('}', '}'),
        ]);
    });
});
