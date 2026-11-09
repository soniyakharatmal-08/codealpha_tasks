import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import { createApp } from '../server.js';

const originalFetch = global.fetch;

test.afterEach(() => {
  global.fetch = originalFetch;
});

test('GET /api/health returns ok', async () => {
  const response = await request(createApp()).get('/api/health').expect(200);

  assert.deepEqual(response.body, { status: 'ok' });
});

test('POST /api/translate returns translated text', async () => {
  global.fetch = async () =>
    new Response(
      JSON.stringify([[['\u0928\u092e\u0938\u094d\u0924\u0947', 'Hello']]]),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  const response = await request(createApp())
    .post('/api/translate')
    .send({ text: 'Hello', source: 'en', target: 'hi' })
    .expect(200);

  assert.equal(response.body.success, true);
  assert.equal(response.body.translatedText, '\u0928\u092e\u0938\u094d\u0924\u0947');
});

test('POST /api/translate falls back when provider does not use target script', async () => {
  const requestedUrls = [];

  global.fetch = async (url) => {
    requestedUrls.push(url.toString());

    if (requestedUrls.length === 1) {
      return new Response(
        JSON.stringify([[['How are you', 'How are you']]]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        responseStatus: 200,
        responseData: { translatedText: '\u0ca8\u0cc0\u0cb5\u0cc1 \u0cb9\u0cc7\u0c97\u0cbf\u0ca6\u0ccd\u0ca6\u0cc0\u0cb0\u0cbf' }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  const response = await request(createApp())
    .post('/api/translate')
    .send({ text: 'How are you', source: 'en', target: 'kn' })
    .expect(200);

  assert.equal(response.body.success, true);
  assert.equal(response.body.translatedText, '\u0ca8\u0cc0\u0cb5\u0cc1 \u0cb9\u0cc7\u0c97\u0cbf\u0ca6\u0ccd\u0ca6\u0cc0\u0cb0\u0cbf');
  assert.match(requestedUrls[0], /sl=en/);
  assert.match(requestedUrls[0], /tl=kn/);
  assert.match(requestedUrls[1], /langpair=en%7Ckn/);
});

test('POST /api/translate normalizes common English shorthand before translation', async () => {
  let requestedUrl = '';

  global.fetch = async (url) => {
    requestedUrl = url.toString();

    return new Response(
      JSON.stringify([[['\u0915\u094d\u092f\u093e \u0924\u0941\u092e\u0928\u0947 \u0905\u092a\u0928\u093e \u0926\u094b\u092a\u0939\u0930 \u0915\u093e \u092d\u094b\u091c\u0928 \u0915\u0930 \u0932\u093f\u092f\u093e, \u0935\u0930\u094d\u0937\u093e?', 'Did you have your lunch, Varsha?']]]),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  const response = await request(createApp())
    .post('/api/translate')
    .send({ text: 'did u have your lunch varsha', source: 'en', target: 'hi' })
    .expect(200);

  assert.equal(response.body.success, true);
  assert.match(response.body.translatedText, /[\u0900-\u097f]/);
  assert.equal(new URL(requestedUrl).searchParams.get('q'), 'did you have your midday meal varsha');
});

test('POST /api/translate rewrites bookish target words to everyday words', async () => {
  global.fetch = async () =>
    new Response(
      JSON.stringify([[['\u092e\u0941\u091d\u0947 \u091c\u0932 \u0914\u0930 \u092d\u094b\u091c\u0928 \u091a\u093e\u0939\u093f\u090f', 'I need water and food']]]),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  const response = await request(createApp())
    .post('/api/translate')
    .send({ text: 'I need water and food', source: 'en', target: 'hi' })
    .expect(200);

  assert.equal(response.body.success, true);
  assert.equal(response.body.translatedText, '\u092e\u0941\u091d\u0947 \u092a\u093e\u0928\u0940 \u0914\u0930 \u0916\u093e\u0928\u093e \u091a\u093e\u0939\u093f\u090f');
});

test('POST /api/translate replaces transliterated English loanwords in Telugu output', async () => {
  let requestedUrl = '';

  global.fetch = async (url) => {
    requestedUrl = url.toString();

    return new Response(
      JSON.stringify([[['\u0c30\u0c02\u0c21\u0c3f \u0c32\u0c02\u0c1a\u0c4d \u0c15\u0c3f \u0c35\u0c46\u0c33\u0c4d\u0c26\u0c3e\u0c02 \u0c36\u0c4d\u0c30\u0c40\u0c24\u0c47\u0c1c', 'Come lets go for lunch Sreetja']]]),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  const response = await request(createApp())
    .post('/api/translate')
    .send({ text: 'come lets go for lunch sreetja', source: 'en', target: 'te' })
    .expect(200);

  const translatedText = response.body.translatedText;

  assert.equal(response.body.success, true);
  assert.equal(new URL(requestedUrl).searchParams.get('q'), 'come lets go for midday meal sreetja');
  assert.doesNotMatch(translatedText, /\u0c32\u0c02\u0c1a\u0c4d/);
  assert.match(translatedText, /\u0c2d\u0c4b\u0c1c\u0c28\u0c3e\u0c28\u0c3f\u0c15\u0c3f/);
});

test('POST /api/translate rejects mixed English letters in non-Latin target output and retries', async () => {
  const requestedUrls = [];

  global.fetch = async (url) => {
    requestedUrls.push(url.toString());

    if (requestedUrls.length === 1) {
      return new Response(
        JSON.stringify([[['hello \u0c38\u0c4d\u0c28\u0c47\u0c39\u0c3f\u0c24\u0c41\u0c21\u0c3e', 'hello friend']]]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        responseStatus: 200,
        responseData: { translatedText: '\u0c28\u0c2e\u0c38\u0c4d\u0c15\u0c3e\u0c30\u0c02 \u0c38\u0c4d\u0c28\u0c47\u0c39\u0c3f\u0c24\u0c41\u0c21\u0c3e' }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  const response = await request(createApp())
    .post('/api/translate')
    .send({ text: 'hello friend', source: 'en', target: 'te' })
    .expect(200);

  assert.equal(response.body.success, true);
  assert.equal(response.body.translatedText, '\u0c28\u0c2e\u0c38\u0c4d\u0c15\u0c3e\u0c30\u0c02 \u0c38\u0c4d\u0c28\u0c47\u0c39\u0c3f\u0c24\u0c41\u0c21\u0c3e');
  assert.equal(requestedUrls.length, 2);
});

test('POST /api/translate cleans non-food English loanwords from Telugu output', async () => {
  global.fetch = async () =>
    new Response(
      JSON.stringify([[['\u0c2c\u0c38\u0c4d \u0c1f\u0c3f\u0c15\u0c46\u0c1f\u0c4d \u0c24\u0c40\u0c38\u0c41\u0c15\u0c4a\u0c28\u0c3f \u0c38\u0c4d\u0c15\u0c42\u0c32\u0c4d \u0c15\u0c3f \u0c35\u0c46\u0c33\u0c4d\u0c32\u0c41', 'Take bus ticket and go to school']]]),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  const response = await request(createApp())
    .post('/api/translate')
    .send({ text: 'take bus ticket and go to school', source: 'en', target: 'te' })
    .expect(200);

  assert.equal(response.body.success, true);
  assert.doesNotMatch(response.body.translatedText, /\u0c2c\u0c38\u0c4d/);
  assert.doesNotMatch(response.body.translatedText, /\u0c1f\u0c3f\u0c15\u0c46\u0c1f\u0c4d/);
  assert.doesNotMatch(response.body.translatedText, /\u0c38\u0c4d\u0c15\u0c42\u0c32\u0c4d/);
  assert.match(response.body.translatedText, /\u0c2a\u0c4d\u0c30\u0c1c\u0c3e \u0c30\u0c35\u0c3e\u0c23\u0c3e \u0c35\u0c3e\u0c39\u0c28\u0c02/);
  assert.match(response.body.translatedText, /\u0c2a\u0c4d\u0c30\u0c2f\u0c3e\u0c23 \u0c1a\u0c40\u0c1f\u0c40/);
  assert.match(response.body.translatedText, /\u0c2a\u0c3e\u0c20\u0c36\u0c3e\u0c32/);
});

test('POST /api/translate understands common romanized Kannada before translating', async () => {
  let requestedUrl = '';

  global.fetch = async (url) => {
    requestedUrl = url.toString();

    return new Response(
      JSON.stringify([[['\u0915\u094d\u092f\u093e \u0924\u0941\u092e\u0928\u0947 \u0916\u093e\u0928\u093e \u0916\u093e\u092f\u093e, \u0938\u0930\u0938\u094d\u0935\u0924\u0940?', 'Did you eat, Saraswati?']]]),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  const response = await request(createApp())
    .post('/api/translate')
    .send({ text: 'uta ajta saraswati', source: 'kn', target: 'hi' })
    .expect(200);

  const searchParams = new URL(requestedUrl).searchParams;

  assert.equal(response.body.success, true);
  assert.equal(response.body.translatedText, '\u0915\u094d\u092f\u093e \u0924\u0941\u092e\u0928\u0947 \u0916\u093e\u0928\u093e \u0916\u093e\u092f\u093e, \u0938\u0930\u0938\u094d\u0935\u0924\u0940?');
  assert.equal(searchParams.get('sl'), 'en');
  assert.equal(searchParams.get('q'), 'Did you eat, saraswati?');
});

test('POST /api/translate rejects empty text', async () => {
  const response = await request(createApp())
    .post('/api/translate')
    .send({ text: '', source: 'en', target: 'hi' })
    .expect(400);

  assert.equal(response.body.message, 'Please enter some text to translate.');
});

test('POST /api/translate rejects same source and target', async () => {
  const response = await request(createApp())
    .post('/api/translate')
    .send({ text: 'Hello', source: 'en', target: 'en' })
    .expect(400);

  assert.equal(response.body.message, 'Source and target languages must be different.');
});

test('POST /api/translate rejects invalid languages', async () => {
  const response = await request(createApp())
    .post('/api/translate')
    .send({ text: 'Hello', source: 'bad-code', target: 'hi' })
    .expect(400);

  assert.equal(response.body.message, 'Please choose a valid source language.');
});

test('POST /api/translate rejects very long input', async () => {
  const response = await request(createApp())
    .post('/api/translate')
    .send({ text: 'a'.repeat(5001), source: 'en', target: 'hi' })
    .expect(400);

  assert.equal(response.body.message, 'Text must be 5000 characters or fewer.');
});

test('POST /api/translate handles provider failure', async () => {
  global.fetch = async () => new Response('Too many requests', { status: 429 });

  const response = await request(createApp())
    .post('/api/translate')
    .send({ text: 'Hello', source: 'en', target: 'hi' })
    .expect(429);

  assert.equal(response.body.message, 'The translation service is busy. Please wait a moment and try again.');
});
