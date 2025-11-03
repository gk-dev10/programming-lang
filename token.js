// (Module 1) Using an object as a 'pseudo-enum'
export const TokenType = {
    PLUS: 'PLUS',
    MINUS: 'MINUS',
    MULTIPLY: 'MULTIPLY',
    DIVIDE: 'DIVIDE',
    LPAREN: 'LPAREN',
    RPAREN: 'RPAREN',
    LBRACE: 'LBRACE', // {
    RBRACE: 'RBRACE', // }
    EQUALS: 'EQUALS', // =
    EQ: 'EQ',         // ==
    NOT_EQ: 'NOT_EQ', // !=
    LT: 'LT',         // <
    GT: 'GT',         // >
    SEMICOLON: 'SEMICOLON',
    
    BANG: 'BANG',     // !   
    AND: 'AND',       // &&  
    OR: 'OR',         // ||  
    
    // Keywords
    LET: 'LET',
    PRINT: 'PRINT',
    IF: 'IF',
    ELSE: 'ELSE',
    TRUE: 'TRUE',
    FALSE: 'FALSE',
    WHILE: 'WHILE',   
    FOR: 'FOR',       
    
    // Literals
    NUMBER: 'NUMBER',
    STRING: 'STRING',
    IDENTIFIER: 'IDENTIFIER',
    EOF: 'EOF'
};

export class Token {
    constructor(type, value = null) {
        this.type = type;
        this.value = value;
    }
}