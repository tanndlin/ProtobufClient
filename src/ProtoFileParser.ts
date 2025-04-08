import * as fs from 'fs';
import { Lexer } from './Lexer';
import Parser from './Parser';

class ProtoFileParser {
    public static fromFileContent(fileContent: string) {
        const lexer = new Lexer(fileContent);
        const tokens = lexer.tokenize();
        return new Parser(tokens).parse();
    }

    public static fromFilePath(filePath: string) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return ProtoFileParser.fromFileContent(fileContent);
    }
}

export default ProtoFileParser;
