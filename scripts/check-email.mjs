#!/usr/bin/env node
/**
 * Diagnóstico del correo transaccional.
 *
 * Uso:
 *   npm run email:test                 # revisa la API key y los dominios
 *   npm run email:test -- tu@correo.mx # además envía un correo de prueba
 *
 * Detecta el proveedor por la forma de la llave: `re_...` = Resend,
 * `e_...` = Emailit. Lee las variables desde `.env` (ver package.json).
 */

const resendKey = (process.env.RESEND_API_KEY || '').trim();
const emailitKey = (process.env.EMAILIT_API_KEY || '').trim();
const from = (process.env.EMAIL_FROM || 'hello@exploraruta.com.mx').trim();
const admin = (process.env.ADMIN_EMAIL || '').trim();
const to = process.argv[2] || '';

function mask(key) {
  if (!key) return '(vacía)';
  return `${key.slice(0, 4)}…${key.slice(-4)} (${key.length} caracteres)`;
}

function detectProvider() {
  if (emailitKey) return { provider: 'emailit', key: emailitKey };
  if (resendKey.startsWith('re_')) return { provider: 'resend', key: resendKey };
  if (resendKey.startsWith('e_')) return { provider: 'emailit', key: resendKey };
  if (resendKey) return { provider: 'resend', key: resendKey };
  return null;
}

function hint(status, body) {
  const text = String(body || '').toLowerCase();
  if (status === 401 || text.includes('invalid api key') || text.includes('unauthorized')) {
    return 'La API key no es válida o fue revocada. Genera una nueva en el panel del proveedor.';
  }
  if (status === 403 || text.includes('not verified') || text.includes('domain')) {
    return 'El remitente no está autorizado. Verifica el dominio de EMAIL_FROM (DNS) o usa un remitente verificado.';
  }
  if (status === 422 || text.includes('from')) {
    return 'El proveedor rechazó el remitente o el payload. Revisa EMAIL_FROM.';
  }
  if (status === 429) return 'Límite de envíos alcanzado; espera y reintenta.';
  return '';
}

async function readJson(response) {
  const raw = await response.text().catch(() => '');
  try {
    return { raw, json: raw ? JSON.parse(raw) : null };
  } catch {
    return { raw, json: null };
  }
}

async function listDomains(provider, key) {
  const url =
    provider === 'resend'
      ? 'https://api.resend.com/domains'
      : 'https://api.emailit.com/v2/domains';

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const { raw, json } = await readJson(response);

  if (!response.ok) {
    console.log(`\n✗ No se pudieron leer los dominios (HTTP ${response.status}).`);
    console.log(`  ${raw.slice(0, 400)}`);
    const h = hint(response.status, raw);
    if (h) console.log(`  → ${h}`);
    return false;
  }

  const list = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
  if (!list.length) {
    console.log('\n! La cuenta no tiene dominios de envío registrados.');
    console.log('  Verifica un dominio (o usa el remitente de pruebas que permita el proveedor).');
    return true;
  }

  console.log('\nDominios de la cuenta:');
  for (const domain of list) {
    const name = domain.name || domain.domain || domain.hostname || '(sin nombre)';
    const status = domain.status || domain.state || domain.verification_status || '(sin estado)';
    const ok = /verified|active|approved/i.test(String(status));
    console.log(`  ${ok ? '✓' : '·'} ${name} — ${status}`);
  }

  const senderDomain = from.includes('@') ? from.split('@').pop().replace(/[>\s].*$/, '') : '';
  const match = list.find(
    (domain) => (domain.name || domain.domain || domain.hostname) === senderDomain
  );
  if (!senderDomain) {
    console.log('\n! EMAIL_FROM no parece incluir un correo válido.');
  } else if (!match) {
    console.log(`\n! ${senderDomain} no aparece en la cuenta: probablemente no podrás enviar desde ${from}.`);
  } else {
    console.log(`\n✓ ${senderDomain} está registrado (estado: ${match.status || match.state || 'desconocido'}).`);
  }
  return true;
}

async function sendTest(provider, key, recipient) {
  const url =
    provider === 'resend'
      ? 'https://api.resend.com/emails'
      : 'https://api.emailit.com/v2/emails';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: recipient,
      subject: 'Prueba de correo · ExploraRuta',
      html: '<p>Si lees esto, el correo transaccional de <strong>ExploraRuta</strong> está funcionando.</p>',
    }),
  });
  const { raw, json } = await readJson(response);

  if (!response.ok) {
    console.log(`\n✗ Envío de prueba falló (HTTP ${response.status}).`);
    console.log(`  ${raw.slice(0, 400)}`);
    const h = hint(response.status, raw);
    if (h) console.log(`  → ${h}`);
    return false;
  }

  const id = json?.id || json?.data?.id || '(sin id)';
  console.log(`\n✓ Correo de prueba aceptado por ${provider}. id: ${id}`);
  console.log(`  De: ${from}`);
  console.log(`  Para: ${recipient}`);
  return true;
}

async function main() {
  const credentials = detectProvider();
  console.log('Diagnóstico de correo · ExploraRuta');
  console.log(`  Remitente (EMAIL_FROM): ${from}`);
  if (admin) console.log(`  Copia al administrador (ADMIN_EMAIL): ${admin}`);

  if (!credentials) {
    console.log('\n✗ No hay API key configurada.');
    console.log('  Define RESEND_API_KEY (re_...) o EMAILIT_API_KEY (e_...) en .env.');
    process.exitCode = 1;
    return;
  }

  console.log(`  Proveedor detectado: ${credentials.provider}`);
  console.log(`  API key: ${mask(credentials.key)}`);

  const domainsOk = await listDomains(credentials.provider, credentials.key);
  if (!domainsOk) process.exitCode = 1;

  if (!to) {
    console.log('\nPara enviar una prueba: npm run email:test -- tu@correo.mx');
    return;
  }

  const sent = await sendTest(credentials.provider, credentials.key, to);
  if (!sent) process.exitCode = 1;
}

main().catch((error) => {
  console.error('\n✗ Error inesperado:', error);
  process.exitCode = 1;
});
