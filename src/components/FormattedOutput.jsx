import React from 'react';

/**
 * A component that formats console output with color highlighting
 */
const FormattedOutput = ({ output }) => {
    if (!output || output.trim() === '') {
        return <span className="output-empty">Console cleared. Click 'Run Code' to see new output...</span>;
    }

    const lines = output.split('\n');
    
    const formatLine = (line, index) => {
        const trimmedLine = line.trim();
        
        // Error lines
        if (trimmedLine.startsWith('--- ERROR ---')) {
            return <span key={index} className="output-error">{line}</span>;
        }
        
        // Section headers
        if (trimmedLine.startsWith('---')) {
            return <span key={index} className="output-header">{line}</span>;
        }
        
        // Empty lines
        if (trimmedLine === '') {
            return <span key={index} className="output-empty-line">\n</span>;
        }
        
        // Try to parse as JSON (for environment output)
        if (line.trim().startsWith('{') || line.trim().startsWith('[')) {
            try {
                const parsed = JSON.parse(line.trim());
                return (
                    <span key={index} className="output-json">
                        {JSON.stringify(parsed, null, 2)}
                    </span>
                );
            } catch {
                // Not valid JSON, continue with normal parsing
            }
        }
        
        // Split by common patterns and apply highlighting
        const parts = [];
        let currentIndex = 0;
        
        // Match numbers (including decimals and negatives)
        const numberRegex = /-?\d+\.?\d*/g;
        // Match strings (in quotes)
        const stringRegex = /"([^"]*)"/g;
        // Match boolean values
        const booleanRegex = /(\btrue\b|\bfalse\b|\bnull\b)/gi;
        
        const matches = [
            ...Array.from(line.matchAll(numberRegex), m => ({ type: 'number', value: m[0], index: m.index })),
            ...Array.from(line.matchAll(stringRegex), m => ({ type: 'string', value: m[0], index: m.index })),
            ...Array.from(line.matchAll(booleanRegex), m => ({ type: 'boolean', value: m[0], index: m.index }))
        ].sort((a, b) => a.index - b.index);
        
        // Remove overlapping matches (prefer earlier matches)
        const nonOverlapping = [];
        let lastEnd = 0;
        for (const match of matches) {
            if (match.index >= lastEnd) {
                nonOverlapping.push(match);
                lastEnd = match.index + match.value.length;
            }
        }
        
        // Build parts array
        for (const match of nonOverlapping) {
            if (match.index > currentIndex) {
                parts.push({ type: 'text', value: line.substring(currentIndex, match.index) });
            }
            parts.push({ type: match.type, value: match.value });
            currentIndex = match.index + match.value.length;
        }
        
        if (currentIndex < line.length) {
            parts.push({ type: 'text', value: line.substring(currentIndex) });
        }
        
        // If no matches found, just return the line as text
        if (parts.length === 0) {
            parts.push({ type: 'text', value: line });
        }
        
        return (
            <span key={index}>
                {parts.map((part, i) => {
                    const className = `output-${part.type}`;
                    return <span key={i} className={className}>{part.value}</span>;
                })}
            </span>
        );
    };
    
    return (
        <span>
            {lines.map((line, index) => (
                <React.Fragment key={index}>
                    {formatLine(line, index)}
                    {index < lines.length - 1 && '\n'}
                </React.Fragment>
            ))}
        </span>
    );
};

export default FormattedOutput;

