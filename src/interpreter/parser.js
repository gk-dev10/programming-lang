import { Token, TokenType } from '../../token.js';
import {
    ProgramNode,
    LetStatementNode,
    AssignmentNode,
    PrintStatementNode,
    BlockStatementNode,
    IfStatementNode,
    WhileLoopNode,
    ForLoopNode,
    IdentifierNode,
    NumberNode,
    StringNode,
    BooleanNode,
    BinaryOpNode,
    UnaryOpNode
} from '../../ast.js';

export class Parser {
    constructor(tokenQueue) {
        this.tokens = tokenQueue; // Our queue
        this.currentToken = this.tokens.shift(); // Dequeue
    }

    advance() {
        this.currentToken = this.tokens.length > 0 ? this.tokens.shift() : new Token(TokenType.EOF);
    }
    
    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.advance();
        } else {
            throw new Error(`Expected ${tokenType}, but got ${this.currentToken.type}`);
        }
    }

    parseProgram() {
        const statements = [];
        while (this.currentToken.type !== TokenType.EOF) {
            statements.push(this.parseStatement());
        }
        return new ProgramNode(statements);
    }

    parseStatement() {
        switch (this.currentToken.type) {
            case TokenType.LET:
                return this.parseLetStatement();
            case TokenType.PRINT:
                return this.parsePrintStatement();
            case TokenType.IF:
                return this.parseIfStatement();
            case TokenType.WHILE: 
                return this.parseWhileLoop();
            case TokenType.FOR: 
                return this.parseForLoop();
            case TokenType.LBRACE:
                return this.parseBlockStatement();
            default:
                // Expression statement (now includes assignment)
                const node = this.parseExpression();
                if (this.currentToken.type === TokenType.SEMICOLON) {
                    this.advance();
                }
                return node;
        }
    }

    parseLetStatement() {
        this.advance(); // Eat 'LET'
        if (this.currentToken.type !== TokenType.IDENTIFIER) throw new Error("Expected identifier after 'let'");
        const identifier = new IdentifierNode(this.currentToken);
        this.advance(); // Eat identifier
        this.eat(TokenType.EQUALS); // Eat '='
        const expression = this.parseExpression();
        if (this.currentToken.type === TokenType.SEMICOLON) {
            this.advance();
        }
        return new LetStatementNode(identifier, expression);
    }

    parsePrintStatement() {
        this.advance(); // Eat 'PRINT'
        this.eat(TokenType.LPAREN);
        const expression = this.parseExpression();
        this.eat(TokenType.RPAREN);
        if (this.currentToken.type === TokenType.SEMICOLON) {
            this.advance();
        }
        return new PrintStatementNode(expression);
    }

    parseBlockStatement() {
        this.eat(TokenType.LBRACE);
        const statements = [];
        while (this.currentToken.type !== TokenType.RBRACE && this.currentToken.type !== TokenType.EOF) {
            statements.push(this.parseStatement());
        }
        this.eat(TokenType.RBRACE);
        return new BlockStatementNode(statements);
    }

    parseIfStatement() {
        this.advance(); // Eat 'IF'
        this.eat(TokenType.LPAREN);
        const condition = this.parseExpression();
        this.eat(TokenType.RPAREN);
        const consequence = this.parseBlockStatement();
        let alternative = null;
        if (this.currentToken.type === TokenType.ELSE) {
            this.advance(); // Eat 'ELSE'
            // MODIFICATION: Allow 'else if' chains
            if (this.currentToken.type === TokenType.IF) {
                alternative = this.parseIfStatement();
            } else {
                alternative = this.parseBlockStatement();
            }
        }
        return new IfStatementNode(condition, consequence, alternative);
    }

    parseWhileLoop() { 
        this.advance(); // Eat 'WHILE'
        this.eat(TokenType.LPAREN);
        const condition = this.parseExpression();
        this.eat(TokenType.RPAREN);
        const body = this.parseBlockStatement();
        return new WhileLoopNode(condition, body);
    }

    parseForLoop() { 
        this.advance(); // Eat 'FOR'
        this.eat(TokenType.LPAREN);

        // Initializer
        let initializer = null;
        if (this.currentToken.type === TokenType.LET) {
            initializer = this.parseLetStatement();
        } else if (this.currentToken.type !== TokenType.SEMICOLON) {
            initializer = this.parseExpression();
            this.eat(TokenType.SEMICOLON);
        } else {
            this.eat(TokenType.SEMICOLON);
        }

        // Condition
        let condition = null;
        if (this.currentToken.type !== TokenType.SEMICOLON) {
            condition = this.parseExpression();
        }
        this.eat(TokenType.SEMICOLON);

        // Increment
        let increment = null;
        if (this.currentToken.type !== TokenType.RPAREN) {
            increment = this.parseExpression();
        }
        this.eat(TokenType.RPAREN);

        // Body
        const body = this.parseBlockStatement();
        
        return new ForLoopNode(initializer, condition, increment, body);
    }

    // --- Precedence-Climbing Recursive Parser (Updated) ---
    // Order: Expression -> Assignment -> Logical OR -> Logical AND -> Comparison -> Term -> Factor -> Primary
    
    parseExpression() { // NEW: Top-level entry
        return this.parseAssignment();
    }

    parseAssignment() { // NEW: Handles i = 10
        const node = this.parseLogicalOr(); // Parse the left-hand side

        if (this.currentToken.type === TokenType.EQUALS) {
            this.advance(); // Eat =
            const value = this.parseAssignment(); // Recursively parse right side

            if (node instanceof IdentifierNode) {
                return new AssignmentNode(node, value);
            } else {
                throw new Error("Invalid assignment target.");
            }
        }

        return node; // Not an assignment
    }

    parseLogicalOr() { // Renamed from parseExpression
        let node = this.parseLogicalAnd();
        while (this.currentToken.type === TokenType.OR) {
            const opToken = this.currentToken;
            this.advance();
            const rightNode = this.parseLogicalAnd();
            node = new BinaryOpNode(node, opToken, rightNode);
        }
        return node;
    }

    parseLogicalAnd() { 
        let node = this.parseComparison();
        while (this.currentToken.type === TokenType.AND) {
            const opToken = this.currentToken;
            this.advance();
            const rightNode = this.parseComparison();
            node = new BinaryOpNode(node, opToken, rightNode);
        }
        return node;
    }

    parseComparison() {
        let node = this.parseTerm();
        while (this.currentToken.type === TokenType.EQ || this.currentToken.type === TokenType.NOT_EQ ||
               this.currentToken.type === TokenType.LT || this.currentToken.type === TokenType.GT) {
            const opToken = this.currentToken;
            this.advance();
            const rightNode = this.parseTerm();
            node = new BinaryOpNode(node, opToken, rightNode);
        }
        return node;
    }

    parseTerm() { // Handles + -
        let node = this.parseFactor();
        while (this.currentToken.type === TokenType.PLUS || this.currentToken.type === TokenType.MINUS) {
            const opToken = this.currentToken;
            this.advance();
            const rightNode = this.parseFactor();
            node = new BinaryOpNode(node, opToken, rightNode);
        }
        return node;
    }

    parseFactor() { // Handles * /
        let node = this.parsePrimary();
        while (this.currentToken.type === TokenType.MULTIPLY || this.currentToken.type === TokenType.DIVIDE) {
            const opToken = this.currentToken;
            this.advance();
            const rightNode = this.parsePrimary();
            node = new BinaryOpNode(node, opToken, rightNode);
        }
        return node;
    }

    parsePrimary() { // Handles atoms, (expr), unary ops
        const token = this.currentToken;
        
        if (token.type === TokenType.NUMBER) {
            this.advance();
            return new NumberNode(token);
        }
        if (token.type === TokenType.STRING) {
            this.advance();
            return new StringNode(token);
        }
        if (token.type === TokenType.TRUE || token.type === TokenType.FALSE) {
            this.advance();
            return new BooleanNode(token);
        }
        if (token.type === TokenType.IDENTIFIER) {
            this.advance();
            return new IdentifierNode(token);
        }
        if (token.type === TokenType.LPAREN) {
            this.advance(); // Eat '('
            const node = this.parseExpression(); // Recursive call to top
            this.eat(TokenType.RPAREN); // Eat ')'
            return node;
        }
        // Unary ops
        if (token.type === TokenType.PLUS || token.type === TokenType.MINUS || token.type === TokenType.BANG) {
            this.advance(); // Eat op
            const rightNode = this.parsePrimary(); // Note: recurses to self
            return new UnaryOpNode(token, rightNode);
        }
        throw new Error(`Unexpected token: ${token.type}`);
    }
}