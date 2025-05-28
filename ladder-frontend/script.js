document.getElementById('url-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const url = document.getElementById('url-input').value.trim();
  if (!url) return;
  const base = '/';
  window.location.href = base + encodeURIComponent(url);
});
