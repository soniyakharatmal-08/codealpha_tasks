import express from 'express';
import {
  MAX_TEXT_LENGTH,
  SUPPORTED_LANGUAGES,
  translateText
} from '../services/translationService.js';

const router = express.Router();
const validLanguageCodes = new Set(SUPPORTED_LANGUAGES.map((language) => language.code));

function validateTranslationRequest({ text, source, target }) {
  if (typeof text !== 'string' || text.trim().length === 0) {
    return 'Please enter some text to translate.';
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return `Text must be ${MAX_TEXT_LENGTH} characters or fewer.`;
  }

  if (typeof source !== 'string' || !validLanguageCodes.has(source)) {
    return 'Please choose a valid source language.';
  }

  if (typeof target !== 'string' || !validLanguageCodes.has(target) || target === 'auto') {
    return 'Please choose a valid target language.';
  }

  if (source === target) {
    return 'Source and target languages must be different.';
  }

  return null;
}

router.post('/', async (req, res) => {
  const validationError = validateTranslationRequest(req.body || {});

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError
    });
  }

  try {
    const translatedText = await translateText({
      text: req.body.text.trim(),
      source: req.body.source,
      target: req.body.target
    });

    return res.json({
      success: true,
      translatedText
    });
  } catch (error) {
    const status = error.statusCode || 500;

    return res.status(status).json({
      success: false,
      message:
        status === 429
          ? 'The translation service is busy. Please wait a moment and try again.'
          : 'Translation service is temporarily unavailable. Please try again.'
    });
  }
});

export default router;
export { validateTranslationRequest };
