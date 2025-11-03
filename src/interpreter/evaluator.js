import { TokenType } from '../../token.js';
import {
    ProgramNode,
    BlockStatementNode,
    LetStatementNode,
    AssignmentNode,
    PrintStatementNode,
    IfStatementNode,
    WhileLoopNode,
    ForLoopNode,
    BinaryOpNode,
    UnaryOpNode,
    IdentifierNode,
    NumberNode,
    StringNode,
    BooleanNode
} from '../../ast.js';

class Environment {
    constructor(outer = null) {
        this.store = new Map();
        this.outer = outer; // (Module 1) Link to parent scope (stack-like)
    }
    
    // Defines a new variable in the *current* scope
    set(name, value) {
        this.store.set(name, value); // (Module 4) Hash Table Insert
        return value;
    }

    // (FIXED) Assigns to an *existing* variable in any scope
    assign(name, value) {
        if (this.store.has(name)) { // Check current scope
            this.store.set(name, value);
            return value;
        }
        if (this.outer !== null) { // (Module 1) Check up the stack
            return this.outer.assign(name, value);
        }
        throw new Error(`Cannot assign to undefined variable '${name}'.`);
    }

    get(name) {
        // (Module 4) Hash Table Lookup
        let value = this.store.get(name);
        if (value === undefined && this.outer !== null) {
            // (Module 1) If not in this scope, check the parent
            value = this.outer.get(name);
        }
        if (value === undefined) throw new Error(`Variable '${name}' not defined.`);
        return value;
    }
}

export class Evaluator {
    constructor(outputLogger) {
        this.outputLogger = outputLogger;
    }

    evaluate(node, env) {
        // (Module 5) Tree Traversal (Visitor pattern)
        // This dispatch logic is the core of the visitor.
        if (node instanceof ProgramNode) {
            return this.evalProgram(node, env);
        } else if (node instanceof BlockStatementNode) {
            return this.evalBlockStatement(node, env);
        } else if (node instanceof LetStatementNode) {
            return this.evalLetStatement(node, env);
        } else if (node instanceof AssignmentNode) { // NEW
            return this.evalAssignmentNode(node, env);
        } else if (node instanceof PrintStatementNode) {
            return this.evalPrintStatement(node, env);
        } else if (node instanceof IfStatementNode) {
            return this.evalIfStatement(node, env);
        } else if (node instanceof WhileLoopNode) { 
            return this.evalWhileLoop(node, env);
        } else if (node instanceof ForLoopNode) { 
            return this.evalForLoop(node, env);
        
        // --- SHORT-CIRCUITING LOGIC ---
        } else if (node instanceof BinaryOpNode) {
            if (node.op.type === TokenType.AND) {
                const left = this.evaluate(node.left, env);
                if (!this.isTruthy(left)) return false; // Short-circuit
                return this.isTruthy(this.evaluate(node.right, env));
            }
            if (node.op.type === TokenType.OR) {
                const left = this.evaluate(node.left, env);
                if (this.isTruthy(left)) return true; // Short-circuit
                return this.isTruthy(this.evaluate(node.right, env));
            }
            // Not AND/OR, so pass to the standard arithmetic eval
            return this.evalBinaryOp(node, env);
        // --- END SHORT-CIRCUITING ---

        } else if (node instanceof UnaryOpNode) {
            return this.evalUnaryOp(node, env);
        } else if (node instanceof IdentifierNode) {
            return env.get(node.value); 
        } else if (node instanceof NumberNode) {
            return node.value; 
        } else if (node instanceof StringNode) {
            return node.value; 
        } else if (node instanceof BooleanNode) {
            return node.value; 
        } else {
            throw new Error(`No evaluation logic for node type: ${node.constructor.name}`);
        }
    }
    
    isTruthy(value) {
        if (value === null || value === false) {
            return false;
        }
        return true;
    }

    evalProgram(node, env) {
        let result = null;
        for (const statement of node.statements) {
            result = this.evaluate(statement, env);
        }
        return result;
    }

    evalBlockStatement(node, env) {
        const blockEnv = new Environment(env); // (Module 1) Create new stack frame
        let result = null;
        for (const statement of node.statements) {
            result = this.evaluate(statement, blockEnv);
        }
        return result;
    }

    evalLetStatement(node, env) {
        const value = this.evaluate(node.expression, env);
        return env.set(node.identifier.value, value); // Use 'set' for new variables
    }

    evalAssignmentNode(node, env) { // NEW
        const value = this.evaluate(node.expression, env);
        return env.assign(node.identifier.value, value); // Use 'assign' for existing
    }

    evalPrintStatement(node, env) {
        const value = this.evaluate(node.expression, env);
        this.outputLogger(value);
        return null;
    }

    evalIfStatement(node, env) {
        const condition = this.evaluate(node.condition, env);
        if (this.isTruthy(condition)) {
            return this.evaluate(node.consequence, env);
        } else if (node.alternative !== null) {
            return this.evaluate(node.alternative, env);
        } else {
            return null;
        }
    }

    evalWhileLoop(node, env) { 
        let result = null;
        while (this.isTruthy(this.evaluate(node.condition, env))) {
            result = this.evaluate(node.body, env);
        }
        return result; 
    }

    evalForLoop(node, env) { 
        const forEnv = new Environment(env); // (Module 1/4) New scope
        let result = null;

        if (node.initializer) {
            this.evaluate(node.initializer, forEnv);
        }
        
        while (true) {
            let conditionVal = true; 
            if (node.condition) {
                conditionVal = this.evaluate(node.condition, forEnv);
            }
            if (!this.isTruthy(conditionVal)) {
                break; 
            }

            result = this.evaluate(node.body, forEnv);

            if (node.increment) {
                this.evaluate(node.increment, forEnv);
            }
        }
        return result;
    }

    evalBinaryOp(node, env) {
        const leftVal = this.evaluate(node.left, env);
        const rightVal = this.evaluate(node.right, env);
        
        switch(node.op.type) {
            case TokenType.PLUS:
                if (typeof leftVal === 'string' || typeof rightVal === 'string') {
                    return String(leftVal) + String(rightVal);
                }
                return leftVal + rightVal;
            case TokenType.MINUS: return leftVal - rightVal;
            case TokenType.MULTIPLY: return leftVal * rightVal;
            case TokenType.DIVIDE: 
                if (rightVal === 0) throw new Error("Cannot divide by zero.");
                return leftVal / rightVal;
            
            case TokenType.EQ: return leftVal === rightVal;
            case TokenType.NOT_EQ: return leftVal !== rightVal;
            case TokenType.LT: return leftVal < rightVal;
            case TokenType.GT: return leftVal > rightVal;
                
            default: throw new Error(`Unknown binary operator: ${node.op.type}`);
        }
    }

    evalUnaryOp(node, env) {
        const rightVal = this.evaluate(node.right, env);
        switch(node.op.type) {
            case TokenType.MINUS: return -rightVal;
            case TokenType.PLUS: return +rightVal;
            case TokenType.BANG: return !this.isTruthy(rightVal); 
            default: throw new Error(`Unknown unary operator: ${node.op.type}`);
        }
    }
}

export { Environment };