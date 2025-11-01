document.addEventListener('DOMContentLoaded', function () {
  const BACKEND_URL = 'http://localhost:5293/login';
  const form = document.querySelector('form');
  if (!form) return;

  const emailInput = form.querySelector('input[type="text"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const submitBtn = form.querySelector('button.login');

  async function postLogin(data) {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json() : await response.text();
    if (!response.ok) {
      const message = (isJson && payload && payload.message) ? payload.message : 'Error en el inicio de sesión';
      throw new Error(message);
    }
    return payload;
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? 'Logging in…' : 'Log In';
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = (emailInput?.value || '').trim();
    const password = (passwordInput?.value || '').trim();

    if (!username || !password) {
      alert('Por favor ingresa tus credenciales.');
      return;
    }

    setLoading(true);
    try {
      const result = await postLogin({ username, password });
      alert('Inicio de sesión exitoso');
    } catch (err) {
      alert(err.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  });
});
