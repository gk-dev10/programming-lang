import React from 'react';
import { FaTrash } from 'react-icons/fa';
import FormattedOutput from './FormattedOutput';

/**
 * The main content area with editor and console.
 */
const MainContent = ({ code, setCode, output, onClearOutput }) => (
    <main className="main-content">
        <div className="content-grid">
            
            {/* Code Editor Column */}
            <div className="editor-section">
                <label htmlFor="code-input" className="editor-label">Code Editor</label>
                <textarea 
                    id="code-input" 
                    className="code-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck="false"
                />
                <p className="editor-hint">Type your code above and press "Run Code".</p>
            </div>

            {/* Output Console Column */}
            <div className="console-section">
                <div className="console-header">
                    <label htmlFor="output-console" className="console-header-label">Console</label>
                    <button 
                        onClick={onClearOutput}
                        className="btn-clear"
                    >
                        <FaTrash /> Clear
                    </button>
                </div>
                <pre 
                    id="output-console" 
                    className="console-output"
                >
                    <FormattedOutput output={output} />
                </pre>
                <p className="console-hint">Shows 'print' output and the final variable state.</p>
            </div>
        </div>
    </main>
);

export default MainContent;
