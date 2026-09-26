SEUShell.init('edit');
(async function () {
  if (!SEUAuth.requireAuth()) return;
  const form = document.getElementById('editor-form');
  const denied = document.getElementById('denied');
  const loading = document.getElementById('loading');
  const validation = document.getElementById('validation');
  const status = document.getElementById('status');
  if (!SEUAuth.canEdit()) {
    loading.hidden = true;
    denied.hidden = false;
    return;
  }
  let data;
  try {
    data = await SEUContent.load();
  } catch (error) {
    loading.textContent = 'Unable to load guide content.';
    loading.className = 'callout danger';
    return;
  }
  if (!data || typeof data !== 'object') {
    loading.textContent = 'Guide content is invalid.';
    loading.className = 'callout danger';
    return;
  }
  loading.hidden = true;
  form.hidden = false;
  let dirty = false;
  const $ = id => document.getElementById(id);
  function markDirty() {
    dirty = true;
    validation.textContent = 'Unsaved changes';
    validation.className = 'editor-status dirty';
  }
  // Minimal editor bootstrap — full UI is in edit.html; handlers for save/cancel:
  $('cancel') && $('cancel').addEventListener('click', function () {
    if (!dirty || confirm('Discard unsaved changes?')) {
      location.replace('home.html?flash=' + encodeURIComponent('Canceled'));
    }
  });
  form && form.addEventListener('submit', async function (event) {
    event.preventDefault();
    // If full editor-app is loaded elsewhere this is a safety handler
  });
})();
