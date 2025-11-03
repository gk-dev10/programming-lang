import React from 'react';

// Helper to create input fields (moved outside component to prevent recreation)
const SettingInput = ({ id, label, valueKey, value, onChange }) => (
    <div className="setting-input-container">
        <label htmlFor={id} className="setting-input-label">{label}</label>
        <input 
            type="text" 
            id={id} 
            value={value}
            onChange={onChange}
            className="setting-input"
        />
    </div>
);

/**
 * The Settings Modal
 */
const SettingsModal = ({ isOpen, onClose, settings, onSettingsChange }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="modal-backdrop"
            onClick={onClose} // Close on backdrop click
        >
            <div 
                className="modal-content settings-modal" 
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Modal Header */}
                <div className="modal-header">
                    <h2 className="modal-title">Language Settings</h2>
                    <button 
                        onClick={onClose}
                        className="btn-close"
                    >
                        &times;
                    </button>
                </div>
                
                {/* Modal Content */}
                <div className="modal-body">
                    <p>Configure the keywords for your language. This will change how the Lexer tokenizes your code.</p>
                    
                    <div className="settings-grid">
                        <SettingInput id="setting-let-keyword" label="Variable Keyword" valueKey="letKeyword" value={settings.letKeyword} onChange={(e) => onSettingsChange('letKeyword', e.target.value)} />
                        <SettingInput id="setting-print-keyword" label="Print Keyword" valueKey="printKeyword" value={settings.printKeyword} onChange={(e) => onSettingsChange('printKeyword', e.target.value)} />
                        <SettingInput id="setting-if-keyword" label="If Keyword" valueKey="ifKeyword" value={settings.ifKeyword} onChange={(e) => onSettingsChange('ifKeyword', e.target.value)} />
                        <SettingInput id="setting-else-keyword" label="Else Keyword" valueKey="elseKeyword" value={settings.elseKeyword} onChange={(e) => onSettingsChange('elseKeyword', e.target.value)} />
                        <SettingInput id="setting-true-keyword" label="True Keyword" valueKey="trueKeyword" value={settings.trueKeyword} onChange={(e) => onSettingsChange('trueKeyword', e.target.value)} />
                        <SettingInput id="setting-false-keyword" label="False Keyword" valueKey="falseKeyword" value={settings.falseKeyword} onChange={(e) => onSettingsChange('falseKeyword', e.target.value)} />
                        <SettingInput id="setting-while-keyword" label="While Keyword" valueKey="whileKeyword" value={settings.whileKeyword} onChange={(e) => onSettingsChange('whileKeyword', e.target.value)} />
                        <SettingInput id="setting-for-keyword" label="For Keyword" valueKey="forKeyword" value={settings.forKeyword} onChange={(e) => onSettingsChange('forKeyword', e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
