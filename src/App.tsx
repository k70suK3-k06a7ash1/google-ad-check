import { useState } from 'react'
import { PunctuationAndSymbolsRule } from './PunctuationAndSymbolsRule'
import type { AdContent, ValidationResult } from './types'
import './App.css'

function App() {
  const [headline, setHeadline] = useState('')
  const [body, setBody] = useState('')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [hasValidated, setHasValidated] = useState(false)

  const rule = new PunctuationAndSymbolsRule()

  const handleValidate = () => {
    const adContent: AdContent = { headline, body }
    const result = rule.validate(adContent)
    setValidationResult(result)
    setHasValidated(true)
  }

  const handleClear = () => {
    setHeadline('')
    setBody('')
    setValidationResult(null)
    setHasValidated(false)
  }

  return (
    <div className="app">
      <header>
        <h1>Google Ad Content Validator</h1>
        <p>Validate your ad content against punctuation and symbols rules</p>
      </header>

      <main>
        <div className="form-section">
          <div className="input-group">
            <label htmlFor="headline">Ad Headline:</label>
            <textarea
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Enter your ad headline..."
              rows={2}
            />
          </div>

          <div className="input-group">
            <label htmlFor="body">Ad Body:</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter your ad body text..."
              rows={4}
            />
          </div>

          <div className="button-group">
            <button onClick={handleValidate} className="validate-btn">
              Validate Ad
            </button>
            <button onClick={handleClear} className="clear-btn">
              Clear
            </button>
          </div>
        </div>

        {hasValidated && validationResult && (
          <div className={`result-section ${validationResult.isValid ? 'valid' : 'invalid'}`}>
            <h2>Validation Result</h2>
            <div className="result-status">
              <span className={`status-indicator ${validationResult.isValid ? 'valid' : 'invalid'}`}>
                {validationResult.isValid ? '✓' : '✗'}
              </span>
              <span className="status-text">
                {validationResult.isValid ? 'Valid' : 'Invalid'}
              </span>
            </div>
            
            {!validationResult.isValid && validationResult.reason && (
              <div className="error-details">
                <h3>Issue Found:</h3>
                <p>{validationResult.reason}</p>
                
                <h3>Suggested Actions:</h3>
                <ul>
                  {rule.getResolutionActions().map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
