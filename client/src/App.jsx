import { useMemo, useState } from 'react';
import LanguageSelect from './components/LanguageSelect.jsx';
import Message from './components/Message.jsx';
import { translateText } from './services/api.js';

const MAX_TEXT_LENGTH = 5000;

const LANGUAGES = [
  { code: 'auto', name: 'Auto Detect' },
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'kn', name: 'Kannada' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mr', name: 'Marathi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ur', name: 'Urdu' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese' }
];

function App() {
  const [source, setSource] = useState('en');
  const [target, setTarget] = useState('hi');
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const charactersUsed = text.length;
  const isOverLimit = charactersUsed > MAX_TEXT_LENGTH;
  const canTranslate = useMemo(
    () => text.trim().length > 0 && source !== target && !isOverLimit && !isLoading,
    [isLoading, isOverLimit, source, target, text]
  );

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2200);
  }

  function validateBeforeTranslate() {
    if (!text.trim()) {
      return 'Please enter some text to translate.';
    }

    if (source === target) {
      return 'Source and target languages must be different.';
    }

    if (isOverLimit) {
      return `Text must be ${MAX_TEXT_LENGTH} characters or fewer.`;
    }

    return '';
  }

  async function handleTranslate() {
    const validationError = validateBeforeTranslate();

    if (validationError) {
      setError(validationError);
      setNotice('');
      return;
    }

    setIsLoading(true);
    setError('');
    setNotice('Translating...');
    setTranslatedText('');
    stopSpeech();

    try {
      const result = await translateText({ text, source, target });
      setTranslatedText(result);
      setNotice('Translation complete.');
    } catch (apiError) {
      setError(apiError.message);
      setNotice('');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!translatedText) {
      setError('There is no translated text to copy yet.');
      return;
    }

    try {
      await navigator.clipboard.writeText(translatedText);
      setError('');
      showNotice('Copied!');
    } catch (copyError) {
      setError('Could not copy the translated text. Please copy it manually.');
    }
  }

  function handleListen() {
    if (!translatedText) {
      setError('There is no translated text to listen to yet.');
      return;
    }

    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      setError('Text-to-speech is not supported in this browser.');
      return;
    }

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = target;
    utterance.onend = () => showNotice('Finished speaking.');
    utterance.onerror = () => setError('Text-to-speech could not play this text.');
    window.speechSynthesis.speak(utterance);
    setError('');
    setNotice('Speaking...');
  }

  function handleClear() {
    stopSpeech();
    setText('');
    setTranslatedText('');
    setError('');
    setNotice('');
    setSource('en');
    setTarget('hi');
  }

  function handleSwapLanguages() {
    if (source === 'auto') {
      setError('Auto Detect cannot be used as a target language.');
      return;
    }

    setSource(target);
    setTarget(source);
    setError('');

    if (translatedText) {
      setText(translatedText);
      setTranslatedText('');
      showNotice('Languages swapped.');
    }
  }

  return (
    <main className="app-shell">
      <section className="translator-card" aria-labelledby="app-title">
        <header className="hero">
          <p className="eyebrow">Simple translation workspace</p>
          <h1 id="app-title">Language Translation Tool</h1>
          <p>Translate text quickly and easily</p>
        </header>

        <div className="language-row">
          <LanguageSelect
            id="source-language"
            label="Source language"
            value={source}
            onChange={setSource}
            languages={LANGUAGES}
            allowAuto
          />

          <button
            className="swap-button"
            type="button"
            onClick={handleSwapLanguages}
            aria-label="Swap source and target languages"
            title="Swap languages"
          >
            Swap
          </button>

          <LanguageSelect
            id="target-language"
            label="Target language"
            value={target}
            onChange={setTarget}
            languages={LANGUAGES}
          />
        </div>

        <div className="text-grid">
          <div className="panel">
            <div className="panel-heading">
              <label htmlFor="source-text">Text to translate</label>
              <span className={isOverLimit ? 'counter danger' : 'counter'}>
                {charactersUsed} / {MAX_TEXT_LENGTH}
              </span>
            </div>
            <textarea
              id="source-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Enter text to translate..."
              aria-describedby="character-count"
            />
            <span id="character-count" className="sr-only">
              {charactersUsed} of {MAX_TEXT_LENGTH} characters used.
            </span>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <label htmlFor="translated-text">Translated text</label>
            </div>
            <textarea
              id="translated-text"
              value={isLoading ? 'Translating...' : translatedText}
              placeholder="Translated text appears here"
              readOnly
            />
          </div>
        </div>

        <Message type="error">{error}</Message>
        <Message type="success">{notice}</Message>

        <div className="actions">
          <button className="primary" type="button" onClick={handleTranslate} disabled={!canTranslate}>
            {isLoading ? 'Translating...' : 'Translate'}
          </button>
          <button type="button" onClick={handleCopy} disabled={!translatedText || isLoading}>
            Copy
          </button>
          <button type="button" onClick={handleListen} disabled={!translatedText || isLoading}>
            Listen
          </button>
          <button className="secondary" type="button" onClick={handleClear}>
            Clear
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
