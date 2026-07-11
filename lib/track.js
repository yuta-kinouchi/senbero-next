const VISITOR_ID_KEY = 'sb_visitor_id';

function getVisitorId() {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

export function trackPageview(path) {
  if (typeof window === 'undefined') return;

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, visitorId: getVisitorId() }),
    keepalive: true,
  }).catch(() => {});
}
