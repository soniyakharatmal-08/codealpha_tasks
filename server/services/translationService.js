export const MAX_TEXT_LENGTH = 5000;

export const SUPPORTED_LANGUAGES = [
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

const MYMEMORY_ENDPOINT = 'https://api.mymemory.translated.net/get';
const GOOGLE_TRANSLATE_ENDPOINT = 'https://translate.googleapis.com/translate_a/single';

const TARGET_SCRIPT_PATTERNS = {
  hi: /[\u0900-\u097f]/,
  kn: /[\u0c80-\u0cff]/,
  te: /[\u0c00-\u0c7f]/,
  ta: /[\u0b80-\u0bff]/,
  ml: /[\u0d00-\u0d7f]/,
  mr: /[\u0900-\u097f]/,
  bn: /[\u0980-\u09ff]/,
  gu: /[\u0a80-\u0aff]/,
  pa: /[\u0a00-\u0a7f]/,
  ur: /[\u0600-\u06ff]/,
  ru: /[\u0400-\u04ff]/,
  ja: /[\u3040-\u30ff\u4e00-\u9fff]/,
  ko: /[\uac00-\ud7af]/,
  'zh-CN': /[\u4e00-\u9fff]/
};

const NON_LATIN_TARGETS = new Set(Object.keys(TARGET_SCRIPT_PATTERNS));

const ENGLISH_SOURCE_REPLACEMENTS = [
  [/\bu\b/gi, 'you'],
  [/\bur\b/gi, 'your'],
  [/\br\b/gi, 'are'],
  [/\blunch\b/gi, 'midday meal'],
  [/\bbus\b/gi, 'public transport vehicle'],
  [/\bschool\b/gi, 'place of study'],
  [/\bcollege\b/gi, 'higher education place'],
  [/\boffice\b/gi, 'workplace'],
  [/\bphone\b/gi, 'telephone device'],
  [/\bmobile\b/gi, 'cellular telephone device'],
  [/\bticket\b/gi, 'travel pass'],
  [/\bmarket\b/gi, 'shopping place'],
  [/\bhospital\b/gi, 'medical care place']
];

const NATURAL_LANGUAGE_REPLACEMENTS = {
  hi: [
    [/\u092c\u0938/g, '\u0938\u093e\u0930\u094d\u0935\u091c\u0928\u093f\u0915 \u0935\u093e\u0939\u0928'],
    [/\u0938\u094d\u0915\u0942\u0932/g, '\u092a\u093e\u0920\u0936\u093e\u0932\u093e'],
    [/\u0915\u0949\u0932\u0947\u091c/g, '\u092e\u0939\u093e\u0935\u093f\u0926\u094d\u092f\u093e\u0932\u092f'],
    [/\u0911\u092b\u093f\u0938/g, '\u0915\u093e\u0930\u094d\u092f\u093e\u0932\u092f'],
    [/\u092b\u094b\u0928/g, '\u0926\u0942\u0930\u092d\u093e\u0937'],
    [/\u092e\u094b\u092c\u093e\u0907\u0932/g, '\u0926\u0942\u0930\u092d\u093e\u0937'],
    [/\u091f\u093f\u0915\u091f/g, '\u092f\u093e\u0924\u094d\u0930\u093e \u092a\u0930\u094d\u091a\u0940'],
    [/\u092e\u093e\u0930\u094d\u0915\u0947\u091f/g, '\u092c\u093e\u091c\u093e\u0930'],
    [/\u0939\u0949\u0938\u094d\u092a\u093f\u091f\u0932/g, '\u0905\u0938\u094d\u092a\u0924\u093e\u0932'],
    [/\u0932\u0902\u091a/g, '\u0926\u094b\u092a\u0939\u0930 \u0915\u093e \u0916\u093e\u0928\u093e'],
    [/\u092d\u094b\u091c\u0928/g, '\u0916\u093e\u0928\u093e'],
    [/\u091c\u0932/g, '\u092a\u093e\u0928\u0940'],
    [/\u0917\u0943\u0939/g, '\u0918\u0930'],
    [/\u0935\u093f\u0926\u094d\u092f\u093e\u0932\u092f/g, '\u0938\u094d\u0915\u0942\u0932'],
    [/\u0915\u094d\u0937\u092e\u093e \u0915\u0930\u0947\u0902/g, '\u092e\u093e\u092b \u0915\u0940\u091c\u093f\u090f']
  ],
  mr: [
    [/\u092d\u094b\u091c\u0928/g, '\u091c\u0947\u0935\u0923'],
    [/\u091c\u0932/g, '\u092a\u093e\u0923\u0940'],
    [/\u0917\u0943\u0939/g, '\u0918\u0930'],
    [/\u0935\u093f\u0926\u094d\u092f\u093e\u0932\u092f/g, '\u0936\u093e\u0933\u093e']
  ],
  kn: [
    [/\u0cac\u0cb8\u0ccd/g, '\u0cb8\u0cbe\u0cb0\u0ccd\u0cb5\u0c9c\u0ca8\u0cbf\u0c95 \u0cb5\u0cbe\u0cb9\u0ca8'],
    [/\u0cb8\u0ccd\u0c95\u0cc2\u0cb2\u0ccd/g, '\u0cb6\u0cbe\u0cb2\u0cc6'],
    [/\u0c95\u0cbe\u0cb2\u0cc7\u0c9c\u0ccd/g, '\u0c95\u0cbe\u0cb2\u0cc7\u0c9c\u0cc1'],
    [/\u0c86\u0cab\u0cc0\u0cb8\u0ccd/g, '\u0c95\u0c9a\u0cc7\u0cb0\u0cbf'],
    [/\u0cab\u0ccb\u0ca8\u0ccd/g, '\u0ca6\u0cc2\u0cb0\u0cb5\u0cbe\u0ca3\u0cbf'],
    [/\u0cae\u0cca\u0cac\u0cc8\u0cb2\u0ccd/g, '\u0ca6\u0cc2\u0cb0\u0cb5\u0cbe\u0ca3\u0cbf'],
    [/\u0c9f\u0cbf\u0c95\u0cc6\u0c9f\u0ccd/g, '\u0caa\u0ccd\u0cb0\u0caf\u0cbe\u0ca3 \u0c9a\u0cc0\u0c9f\u0cbf'],
    [/\u0cae\u0cbe\u0cb0\u0ccd\u0c95\u0cc6\u0c9f\u0ccd/g, '\u0cb8\u0c82\u0ca4\u0cc6'],
    [/\u0cb9\u0cbe\u0cb8\u0ccd\u0caa\u0cbf\u0c9f\u0cb2\u0ccd/g, '\u0c86\u0cb8\u0ccd\u0caa\u0ca4\u0ccd\u0cb0\u0cc6'],
    [/\u0cb2\u0c82\u0c9a\u0ccd/g, '\u0c8a\u0c9f'],
    [/\u0cad\u0ccb\u0c9c\u0ca8/g, '\u0c8a\u0c9f'],
    [/\u0c9c\u0cb2/g, '\u0ca8\u0cc0\u0cb0\u0cc1']
  ],
  te: [
    [/\u0c2c\u0c38\u0c4d/g, '\u0c2a\u0c4d\u0c30\u0c1c\u0c3e \u0c30\u0c35\u0c3e\u0c23\u0c3e \u0c35\u0c3e\u0c39\u0c28\u0c02'],
    [/\u0c38\u0c4d\u0c15\u0c42\u0c32\u0c4d/g, '\u0c2a\u0c3e\u0c20\u0c36\u0c3e\u0c32'],
    [/\u0c15\u0c3e\u0c32\u0c47\u0c1c\u0c4d/g, '\u0c15\u0c33\u0c3e\u0c36\u0c3e\u0c32'],
    [/\u0c06\u0c2b\u0c40\u0c38\u0c4d/g, '\u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c3e\u0c32\u0c2f\u0c02'],
    [/\u0c2b\u0c4b\u0c28\u0c4d/g, '\u0c26\u0c42\u0c30\u0c35\u0c3e\u0c23\u0c3f'],
    [/\u0c2e\u0c4a\u0c2c\u0c48\u0c32\u0c4d/g, '\u0c1a\u0c30\u0c35\u0c3e\u0c23\u0c3f'],
    [/\u0c1f\u0c3f\u0c15\u0c46\u0c1f\u0c4d/g, '\u0c2a\u0c4d\u0c30\u0c2f\u0c3e\u0c23 \u0c1a\u0c40\u0c1f\u0c40'],
    [/\u0c2e\u0c3e\u0c30\u0c4d\u0c15\u0c46\u0c1f\u0c4d/g, '\u0c38\u0c02\u0c24'],
    [/\u0c39\u0c3e\u0c38\u0c4d\u0c2a\u0c3f\u0c1f\u0c32\u0c4d/g, '\u0c06\u0c38\u0c41\u0c2a\u0c24\u0c4d\u0c30\u0c3f'],
    [/\u0c32\u0c02\u0c1a\u0c4d\s*\u0c15\u0c3f/g, '\u0c2d\u0c4b\u0c1c\u0c28\u0c3e\u0c28\u0c3f\u0c15\u0c3f'],
    [/\u0c32\u0c02\u0c1a\u0c4d\s*\u0c15\u0c41/g, '\u0c2d\u0c4b\u0c1c\u0c28\u0c3e\u0c28\u0c3f\u0c15\u0c3f'],
    [/\u0c32\u0c02\u0c1a\u0c4d/g, '\u0c2d\u0c4b\u0c1c\u0c28\u0c02'],
    [/\u0c2d\u0c4b\u0c1c\u0c28\u0c02/g, '\u0c24\u0c3f\u0c02\u0c21\u0c3f'],
    [/\u0c1c\u0c32\u0c02/g, '\u0c28\u0c40\u0c33\u0c4d\u0c32\u0c41']
  ],
  ta: [
    [/\u0bb2\u0b9e\u0bcd\u0b9a\u0bcd/g, '\u0bae\u0ba4\u0bbf\u0baf \u0b89\u0ba3\u0bb5\u0bc1'],
    [/\u0b89\u0ba3\u0bb5\u0bc1/g, '\u0b9a\u0bbe\u0baa\u0bcd\u0baa\u0bbe\u0b9f\u0bc1'],
    [/\u0ba8\u0bc0\u0bb0\u0bcd/g, '\u0ba4\u0ba3\u0bcd\u0ba3\u0bc0\u0bb0\u0bcd']
  ],
  ml: [
    [/\u0d2d\u0d15\u0d4d\u0d37\u0d23\u0d02/g, '\u0d06\u0d39\u0d3e\u0d30\u0d02'],
    [/\u0d1c\u0d32\u0d02/g, '\u0d35\u0d46\u0d33\u0d4d\u0d33\u0d02']
  ],
  bn: [
    [/\u09b2\u09be\u099e\u09cd\u099a/g, '\u09a6\u09c1\u09aa\u09c1\u09b0\u09c7\u09b0 \u0996\u09be\u09ac\u09be\u09b0'],
    [/\u09ad\u09cb\u099c\u09a8/g, '\u0996\u09be\u09ac\u09be\u09b0'],
    [/\u099c\u09b2/g, '\u09aa\u09be\u09a8\u09bf'],
    [/\u0997\u09c3\u09b9/g, '\u09ac\u09be\u09a1\u09bc\u09bf']
  ],
  gu: [
    [/\u0ab2\u0a82\u0a9a/g, '\u0aac\u0aaa\u0acb\u0ab0\u0aa8\u0ac1\u0a82 \u0a96\u0abe\u0ab5\u0abe\u0aa8\u0ac1\u0a82'],
    [/\u0aad\u0acb\u0a9c\u0aa8/g, '\u0a96\u0abe\u0ab5\u0abe\u0aa8\u0ac1\u0a82'],
    [/\u0a9c\u0ab3/g, '\u0aaa\u0abe\u0aa3\u0ac0'],
    [/\u0a97\u0ac3\u0ab9/g, '\u0a98\u0ab0']
  ],
  pa: [
    [/\u0a32\u0a70\u0a1a/g, '\u0a26\u0a41\u0a2a\u0a39\u0a3f\u0a30 \u0a26\u0a3e \u0a16\u0a3e\u0a23\u0a3e'],
    [/\u0a2d\u0a4b\u0a1c\u0a28/g, '\u0a16\u0a3e\u0a23\u0a3e'],
    [/\u0a1c\u0a32/g, '\u0a2a\u0a3e\u0a23\u0a40'],
    [/\u0a17\u0a4d\u0a30\u0a39/g, '\u0a18\u0a30']
  ]
};

const ROMANIZED_SOURCE_BRIDGES = {
  kn: [
    {
      pattern: /^\s*(?:oota|uta|oota|oo?ta)\s+(?:ayta|aita|aayta|aytha|aaytha|ajta)\s*(.*)$/i,
      buildText: (match) => {
        const name = match[1]?.trim();
        return name ? `Did you eat, ${name}?` : 'Did you eat?';
      }
    }
  ]
};

function normalizeForComparison(value) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function isUsableTranslation({ originalText, translatedText, target }) {
  if (typeof translatedText !== 'string' || translatedText.trim().length === 0) {
    return false;
  }

  if (normalizeForComparison(originalText) === normalizeForComparison(translatedText)) {
    return false;
  }

  const targetPattern = TARGET_SCRIPT_PATTERNS[target];

  if (targetPattern && !targetPattern.test(translatedText)) {
    return false;
  }

  if (NON_LATIN_TARGETS.has(target) && /[\p{Script=Latin}]/u.test(translatedText)) {
    return false;
  }

  return true;
}

function hasOnlyLatinText(value) {
  return /^[\p{Script=Latin}\p{N}\s.,!?'"-]+$/u.test(value);
}

function prepareTextForTranslation({ text, source }) {
  const bridgeRules = ROMANIZED_SOURCE_BRIDGES[source] || [];

  if (hasOnlyLatinText(text)) {
    for (const { pattern, buildText } of bridgeRules) {
      const match = text.match(pattern);

      if (match) {
        return {
          text: buildText(match),
          source: 'en'
        };
      }
    }
  }

  if (source !== 'en') {
    return { text, source };
  }

  return {
    text: ENGLISH_SOURCE_REPLACEMENTS.reduce(
      (preparedText, [pattern, replacement]) => preparedText.replace(pattern, replacement),
      text
    ),
    source
  };
}

function makeTranslationSoundNatural({ translatedText, target }) {
  const replacements = NATURAL_LANGUAGE_REPLACEMENTS[target] || [];

  return replacements.reduce(
    (naturalText, [formalPattern, everydayWord]) => naturalText.replace(formalPattern, everydayWord),
    translatedText
  );
}

function createServiceError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function translateWithMyMemory({ text, source, target }) {
  const sourceCode = source === 'auto' ? 'auto' : source;
  const url = new URL(MYMEMORY_ENDPOINT);

  url.searchParams.set('q', text);
  url.searchParams.set('langpair', `${sourceCode}|${target}`);

  const response = await fetch(url);

  if (response.status === 429) {
    throw createServiceError('Rate limited by translation service.', 429);
  }

  if (!response.ok) {
    throw createServiceError('Translation provider returned an error.');
  }

  const data = await response.json();
  const translatedText = data?.responseData?.translatedText;
  const responseStatus = Number(data?.responseStatus);

  if (responseStatus && responseStatus >= 400) {
    throw createServiceError('Translation provider rejected the request.', responseStatus === 429 ? 429 : 500);
  }

  if (typeof translatedText !== 'string' || translatedText.trim().length === 0) {
    throw createServiceError('Translation provider returned an unexpected response.');
  }

  return translatedText;
}

async function translateWithGoogle({ text, source, target }) {
  const url = new URL(GOOGLE_TRANSLATE_ENDPOINT);

  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', source === 'auto' ? 'auto' : source);
  url.searchParams.set('tl', target);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);

  const response = await fetch(url);

  if (response.status === 429) {
    throw createServiceError('Rate limited by translation service.', 429);
  }

  if (!response.ok) {
    throw createServiceError('Translation provider returned an error.');
  }

  const data = await response.json();
  const translatedText = Array.isArray(data?.[0])
    ? data[0].map((part) => part?.[0]).filter(Boolean).join('')
    : '';

  if (typeof translatedText !== 'string' || translatedText.trim().length === 0) {
    throw createServiceError('Translation provider returned an unexpected response.');
  }

  return translatedText;
}

export async function translateText({ text, source, target }) {
  const preparedInput = prepareTextForTranslation({ text, source });
  const providers = [translateWithGoogle, translateWithMyMemory];
  let lastError;

  for (const provider of providers) {
    try {
      const translatedText = await provider({ text: preparedInput.text, source: preparedInput.source, target });
      const naturalText = makeTranslationSoundNatural({ translatedText, target });

      if (isUsableTranslation({ originalText: preparedInput.text, translatedText: naturalText, target })) {
        return naturalText;
      }

      lastError = createServiceError('Translation provider did not return the requested target language.');
    } catch (error) {
      lastError = error;

      if (error.statusCode === 429) {
        throw error;
      }
    }
  }

  throw lastError || createServiceError('Translation service is temporarily unavailable.');
}
