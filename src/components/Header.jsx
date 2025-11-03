import React from 'react';
import { FaPlay, FaCog, FaQuestionCircle, FaSpinner } from 'react-icons/fa';

/**
 * The header component with buttons.
 */
const Header = ({ onHelpClick, onSettingsClick, onRunClick, isRunning }) => (
    <nav className="header">
        <div className="header-content">
            <div>
                <h1 className="header-title">Code Interpreter</h1>
            </div>
            <div className="header-buttons">
                <button 
                    onClick={onHelpClick}
                    className="btn btn-secondary"
                >
                    <FaQuestionCircle />
                    Syntax & Help
                </button>
                <button 
                    onClick={onSettingsClick}
                    className="btn btn-secondary"
                >
                    <FaCog />
                    Settings
                </button>
                <button 
                    onClick={onRunClick}
                    className="btn btn-primary"
                    disabled={isRunning}
                >
                    {isRunning ? (
                        <>
                            <FaSpinner className="btn-spinner" />
                            Running...
                        </>
                    ) : (
                        <>
                            <FaPlay />
                            Run Code
                        </>
                    )}
                </button>
            </div>
        </div>
    </nav>
);

export default Header;
