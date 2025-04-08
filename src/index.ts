import { Lexer } from './Lexer';

const protoContent = `
message ExampleMessage {
    string temp = 1;
    int32 temp2 = 2;
}
`;

const tokens = new Lexer(protoContent).tokenize();
console.log(tokens);
