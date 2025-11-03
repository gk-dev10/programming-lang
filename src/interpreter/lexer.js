import { Token, TokenType } from '../../token.js';

export class Lexer {
    constructor(text, settings = {}) {
        this.text = text;
        this.pos = 0;
        this.currentChar = this.text[this.pos];
        
        // (Module 4) Hash Table (using JS Map) for keywords
        this.KEYWORDS = new Map([
            [settings.letKeyword || "let", new Token(TokenType.LET)],
            [settings.printKeyword || "print", new Token(TokenType.PRINT)],
            [settings.ifKeyword || "if", new Token(TokenType.IF)],
            [settings.elseKeyword || "else", new Token(TokenType.ELSE)],
            [settings.trueKeyword || "true", new Token(TokenType.TRUE)],
            [settings.falseKeyword || "false", new Token(TokenType.FALSE)],
            [settings.whileKeyword || "while", new Token(TokenType.WHILE)], 
            [settings.forKeyword || "for", new Token(TokenType.FOR)],       
        ]);
    }

    advance() {
        this.pos++;
        this.currentChar = this.pos < this.text.length ? this.text[this.pos] : null;
    }

    peek() {
        // Look ahead one character
        return this.pos + 1 < this.text.length ? this.text[this.pos + 1] : null;
    }

    isWhitespace(char) { return /\s/.test(char); }
    isDigit(char) { return /[0-9]/.test(char); }
    isAlpha(char) { 
        // Support Unicode letters from any language (scripts like Arabic, Chinese, Japanese, Tamil, etc.)
        // Also include combining marks (like Tamil virama ்) which are part of identifiers
        return /[\p{L}\p{M}_]/u.test(char); 
    }
    isAlphaNumeric(char) { 
        // Support Unicode letters, numbers, and combining marks (for scripts like Tamil)
        return /[\p{L}\p{N}\p{M}_]/u.test(char); 
    }
    
    getNumber() {
        let result = "";
        while (this.currentChar !== null && this.isDigit(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        if (this.currentChar === '.') {
            result += '.';
            this.advance();
            while (this.currentChar !== null && this.isDigit(this.currentChar)) {
                result += this.currentChar;
                this.advance();
            }
        }
        return new Token(TokenType.NUMBER, parseFloat(result));
    }

    getString() {
        this.advance(); // Eat the opening "
        let result = "";
        while (this.currentChar !== null && this.currentChar !== '"') {
            result += this.currentChar;
            this.advance();
        }
        if (this.currentChar !== '"') {
            throw new Error("Unterminated string.");
        }
        this.advance(); // Eat the closing "
        return new Token(TokenType.STRING, result);
    }

    getIdentifier() {
        let result = "";
        while (this.currentChar !== null && this.isAlphaNumeric(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return this.KEYWORDS.get(result) || new Token(TokenType.IDENTIFIER, result);
    }

    getAllTokens() {
        // (Module 1/2) Using an Array as a Queue
        const tokenQueue = []; // push() to enqueue, shift() to dequeue
        
        while (this.currentChar !== null) {
            if (this.isWhitespace(this.currentChar)) {
                this.advance();
                continue;
            }
            if (this.isDigit(this.currentChar)) {
                tokenQueue.push(this.getNumber());
                continue;
            }
            if (this.isAlpha(this.currentChar)) {
                tokenQueue.push(this.getIdentifier());
                continue;
            }
            if (this.currentChar === '"') {
                tokenQueue.push(this.getString());
                continue;
            }

            // Multi-char tokens (==, !=, &&, ||)
            if (this.currentChar === '=' && this.peek() === '=') {
                this.advance(); this.advance();
                tokenQueue.push(new Token(TokenType.EQ));
                continue;
            }
            if (this.currentChar === '!' && this.peek() === '=') {
                this.advance(); this.advance();
                tokenQueue.push(new Token(TokenType.NOT_EQ));
                continue;
            }
            if (this.currentChar === '&' && this.peek() === '&') { 
                this.advance(); this.advance();
                tokenQueue.push(new Token(TokenType.AND));
                continue;
            }
            if (this.currentChar === '|' && this.peek() === '|') { 
                this.advance(); this.advance();
                tokenQueue.push(new Token(TokenType.OR));
                continue;
            }

            // Single-char tokens
            let tokenType = null;
            switch(this.currentChar) {
                case '+': tokenType = TokenType.PLUS; break;
                case '-': tokenType = TokenType.MINUS; break;
                case '*': tokenType = TokenType.MULTIPLY; break;
                case '/': tokenType = TokenType.DIVIDE; break;
                case '(': tokenType = TokenType.LPAREN; break;
                case ')': tokenType = TokenType.RPAREN; break;
                case '{': tokenType = TokenType.LBRACE; break;
                case '}': tokenType = TokenType.RBRACE; break;
                case '=': tokenType = TokenType.EQUALS; break;
                case '<': tokenType = TokenType.LT; break;
                case '>': tokenType = TokenType.GT; break;
                case ';': tokenType = TokenType.SEMICOLON; break;
                case '!': tokenType = TokenType.BANG; break; 
            }

            if (tokenType) {
                tokenQueue.push(new Token(tokenType));
                this.advance();
            } else {
                throw new Error(`Invalid character: ${this.currentChar}`);
            }
        }
        tokenQueue.push(new Token(TokenType.EOF));
        return tokenQueue;
    }
}