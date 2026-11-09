const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function translateText({ text, source, target }) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, source, target })
    });
  } catch (error) {
    throw new Error('Server unavailable. Please make sure the backend is running.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || 'Translation service is temporarily unavailable. Please try again.');
  }

  return data.translatedText;
}
