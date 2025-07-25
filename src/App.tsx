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
      <div className="content-area">
        <header>
          <h1>Google広告コンテンツバリデーター</h1>
          <p>句読点と記号のルールに対して広告コンテンツを検証します</p>
        </header>

        <main>
          <div className="form-section">
            <div className="input-group">
              <label htmlFor="headline">広告見出し:</label>
              <textarea
                id="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="広告見出しを入力してください..."
                rows={2}
              />
            </div>

            <div className="input-group">
              <label htmlFor="body">広告本文:</label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="広告本文を入力してください..."
                rows={4}
              />
            </div>

            <div className="button-group">
              <button onClick={handleValidate} className="validate-btn">
                検証実行
              </button>
              <button onClick={handleClear} className="clear-btn">
                クリア
              </button>
            </div>
          </div>

          {hasValidated && validationResult && (
            <div className={`result-section ${validationResult.isValid ? 'valid' : 'invalid'}`}>
              <h2>検証結果</h2>
              <div className="result-status">
                <span className={`status-indicator ${validationResult.isValid ? 'valid' : 'invalid'}`}>
                  {validationResult.isValid ? '✓' : '✗'}
                </span>
                <span className="status-text">
                  {validationResult.isValid ? '有効' : '無効'}
                </span>
              </div>
              
              {!validationResult.isValid && validationResult.reason && (
                <div className="error-details">
                  <h3>発見された問題:</h3>
                  <p>{validationResult.reason}</p>
                  
                  <h3>推奨アクション:</h3>
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
      
      <div className="sidebar">
        <div className="rules-info">
          <h3>検証ルール</h3>
          <ul>
            <li>見出しでの感嘆符の使用禁止</li>
            <li>複数の句読点（!!や??）の使用禁止</li>
            <li>記号や句読点の繰り返し禁止</li>
            <li>非標準の記号使用（@ home、4 saleなど）禁止</li>
            <li>非標準の上付き文字の使用禁止</li>
            <li>強調のための記号の過度な使用禁止</li>
            <li>無効な文字（絵文字、特殊記号）の使用禁止</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
