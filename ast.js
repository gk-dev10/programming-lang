import { TokenType } from './token.js';

// --- AST (Module 5: Trees) ---
class ASTNode {}
export class ProgramNode extends ASTNode {
    constructor(statements) { super(); this.statements = statements; }
}
export class LetStatementNode extends ASTNode {
    constructor(identifier, expression) { super(); this.identifier = identifier; this.expression = expression; }
}
export class AssignmentNode extends ASTNode { // NEW
    constructor(identifier, expression) {
        super();
        this.identifier = identifier; // This is an IdentifierNode
        this.expression = expression;
    }
}
export class PrintStatementNode extends ASTNode {
    constructor(expression) { super(); this.expression = expression; }
}
export class BlockStatementNode extends ASTNode {
    constructor(statements) { super(); this.statements = statements; }
}
export class IfStatementNode extends ASTNode {
    constructor(condition, consequence, alternative) {
        super();
        this.condition = condition;
        this.consequence = consequence;
        this.alternative = alternative;
    }
}
export class WhileLoopNode extends ASTNode { 
    constructor(condition, body) {
        super();
        this.condition = condition;
        this.body = body; // A BlockStatementNode
    }
}
export class ForLoopNode extends ASTNode { 
    constructor(initializer, condition, increment, body) {
        super();
        this.initializer = initializer;
        this.condition = condition;
        this.increment = increment;
        this.body = body; // A BlockStatementNode
    }
}
export class IdentifierNode extends ASTNode {
    constructor(token) { super(); this.token = token; this.value = token.value; }
}
export class NumberNode extends ASTNode {
    constructor(token) { super(); this.token = token; this.value = token.value; }
}
export class StringNode extends ASTNode {
    constructor(token) { super(); this.token = token; this.value = token.value; }
}
export class BooleanNode extends ASTNode {
    constructor(token) { super(); this.token = token; this.value = (token.type === TokenType.TRUE); }
}
export class BinaryOpNode extends ASTNode {
    constructor(left, op, right) { super(); this.left = left; this.op = op; this.right = right; }
}
export class UnaryOpNode extends ASTNode {
    constructor(op, right) { super(); this.op = op; this.right = right; }
}