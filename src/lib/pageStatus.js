export async function updatePageStatus(submissionId) {
  const url = new URL(import.meta.env.VITE_APPS_SCRIPT_URL);
  url.searchParams.set('action', 'updatePageStatus');
  url.searchParams.set('submissionId', submissionId);

  console.log('[pageStatus] sending request', {
    submissionId,
    url: url.toString(),
  });

  const res = await fetch(url);
  const bodyText = await res.text();

  console.log('[pageStatus] response received', {
    submissionId,
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    body: bodyText,
  });

  if (!res.ok) {
    throw new Error(`Failed to update page status (${res.status}): ${bodyText}`);
  }

  try {
    return JSON.parse(bodyText);
  } catch (err) {
    console.error('[pageStatus] failed to parse JSON response', {
      submissionId,
      bodyText,
      error: err,
    });
    throw new Error(`Invalid JSON response: ${bodyText}`);
  }
}
