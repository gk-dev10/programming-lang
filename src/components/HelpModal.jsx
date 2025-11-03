import React from 'react';

/**
 * The Help & Syntax Modal.
 */
const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="modal-backdrop"
            onClick={onClose} // Close on backdrop click
        >
            <div 
                className="modal-content help-modal" 
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Modal Header */}
                <div className="modal-header">
                    <h2 className="modal-title">Syntax & Help Guide</h2>
                    <button 
                        onClick={onClose}
                        className="btn-close"
                    >
                        &times;
                    </button>
                </div>
                
                {/* Modal Content */}
                <div className="modal-body">
                    <h3>Welcome!</h3>
                    <p>
                        This is a simple interpreter for a custom language. It reads your code, calculates the results, and stores variables.
                        The console on the right shows the output from <b>print</b> statements and the final state of all your variables.
                    </p>

                    <h3>1. Variables (Definition vs. Assignment)</h3>
                    <p>
                        Use <code>let</code> to <b>define</b> a new variable. This creates the variable in the current scope.
                    </p>
                    <pre><code>let x = 10;</code></pre>
                    <p>
                        Use <code>=</code> on an *existing* variable to <b>assign</b> a new value to it.
                    </p>
                    <pre><code>let x = 10;<br/>x = x + 5; // x is now 15</code></pre>
                    <p style={{fontSize: '0.875rem', color: '#93c5fd', marginTop: '0.5rem', marginBottom: '0.5rem'}}>
                        <b>Note:</b> You can change the 'let' keyword in the <b>Settings</b> panel! Variable names support Unicode characters, so you can use letters from any language.
                    </p>
                    <pre><code>let 变量 = 42;<br/>let арабский = 100;<br/>let 日本語 = "Hello!";<br/>let தமிழ் = "வணக்கம்";</code></pre>
                    
                    <h3>2. Data Types</h3>
                    <p>We now support three data types:</p>
                    <ul>
                        <li><strong>Numbers:</strong> All numbers (e.g., <code>10</code>, <code>5.5</code>, <code>-3</code>).</li>
                        <li><strong>Booleans:</strong> <code>true</code> or <code>false</code>.</li>
                        <li><strong>Strings:</strong> Text surrounded by double quotes (e.g., <code>"Hello"</code>).</li>
                    </ul>

                    <h3>3. Printing to Console</h3>
                    <p>Use the <code>print</code> statement to output a value to the console.</p>
                    <pre><code>print(10 + 5);  // Outputs: 15<br/>print("Hello World!"); // Outputs: Hello World!</code></pre>

                    <h3>4. Operators</h3>
                    <p>Standard arithmetic and logical operators are supported.</p>
                    <p>Operators:</p>
                    <ul>
                        <li>Assignment: <code>=</code></li>
                        <li>Arithmetic: <code>+</code> (Addition / String Concatenation), <code>-</code>, <code>*</code>, <code>/</code></li>
                        <li>Unary: <code>-</code> (negative), <code>!</code> (logical NOT)</li>
                        <li>Comparison: <code>==</code> (equal), <code>!=</code> (not equal), <code>&lt;</code> (less than), <code>&gt;</code> (greater than)</li>
                        <li>Logical: <code>&&</code> (AND), <code>||</code> (OR). These are short-circuiting.</li>
                    </ul>
                    <pre><code>print(10 &gt; 5 && "a" == "a"); // Outputs: true<br/>print(10 &lt; 5 || true);     // Outputs: true<br/>print(!false);             // Outputs: true</code></pre>

                    <h3>5. Control Flow (if/else)</h3>
                    <p>
                        Use <code>if</code> and <code>else</code> to control which code executes. Code blocks <b>must</b> be surrounded by <code>{ }</code> braces.
                    </p>
                    <pre><code>{`let x = 10;
if (x > 5 && x < 20) {
    print("x is between 5 and 20");
} else {
    print("x is not in range");
}`}</code></pre>
                    <h3>6. Loops (while / for)</h3>
                    <p>
                        <b>while loops</b> repeat as long as a condition is true.
                    </p>
                    <pre><code>{`let i = 0;
while (i < 3) {
    print(i);
    i = i + 1; // Assignment
}
// Outputs: 0, 1, 2`}</code></pre>
                    <p>
                        <b>for loops</b> are C-style loops with an initializer, condition, and increment.
                    </p>
                    <pre><code>{`for (let j = 0; j < 3; j = j + 1) {
    print(j);
}
// Outputs: 0, 1, 2`}</code></pre>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
