# ExploraRuta

Sitio de rutas gastronómicas y experiencias locales en México. Incluye catálogo,
carrito, checkout con pago real mediante Octano y correos transaccionales
localizados en español e inglés.

## Tecnología y desarrollo

- Next.js 14, React 18, TypeScript y Tailwind CSS.
- Node.js 18.17 o superior y npm 9 o superior.

La identidad visual combina verde bosque, terracota y superficies crema. El
isotipo monocolor integra las iniciales V/C con un marcador de destino.

```bash
npm ci
cp .env.example .env
# Completa OCTANO_EMAIL, OCTANO_PASSWORD y RESEND_API_KEY en .env
npm run dev
```

La app de desarrollo abre en `http://localhost:3003`. Las credenciales viven
únicamente en `.env`; no se incluyen en el repositorio ni en el código fuente.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `OCTANO_BASE_URL` | URL base de la API de Octano. |
| `OCTANO_EMAIL` / `OCTANO_PASSWORD` | Credenciales de la cuenta de Octano. |
| `RESEND_API_KEY` | Llave de Resend (`re_...`) o Emailit (`e_...`). |
| `EMAIL_FROM` | Remitente verificado en el proveedor. |
| `ADMIN_EMAIL` | Copia interna de compras y mensajes de contacto. |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Correo de contacto mostrado en la interfaz. |
| `NEXT_PUBLIC_CONTACT_PHONE` | Teléfono público (por defecto, +52 1 55 5662 5469). |
| `PORT` | Puerto del servidor de desarrollo (`3003` por defecto). |

Si cambias las llaves de producción solo debes actualizar `.env`; la aplicación
las lee en tiempo de ejecución.

## Reservas y pagos

`POST /api/payment` valida el carrito contra el catálogo, recalcula el total en
el servidor y procesa el cobro con Octano:

1. Inicio de sesión en Octano.
2. Tokenización de la tarjeta.
3. Cargo con el token y el CVV.

El año de expiración se envía a Octano con **dos dígitos** (`30`, no `2030`).
Los datos de tarjeta nunca se guardan ni se registran en logs. Si el pago se
aprueba, la API devuelve el folio y la transacción, envía los correos de compra
al cliente y al administrador, y la tienda muestra la página de confirmación.

## Correo

Los correos de compra y de contacto se generan en el idioma activo del sitio
(español o inglés) y usan las plantillas de `src/lib/email.ts`. El remitente
debe estar verificado en Resend o Emailit. Para probar el transporte:

```bash
npm run email:test -- correo@ejemplo.com
```

Si el proveedor falla, el mensaje se guarda en `.mail-outbox/` para no perder
la confirmación mientras se corrige la configuración.

## Diseño y contenido

- Paleta: naranja `#F25C05`, café profundo `#2E1A10` y beige `#FAF4E9`.
- Tipografías: Sora (títulos) y Manrope (texto).
- Logos y favicon propios en `public/`.
- El catálogo incluye 17 experiencias en cuatro categorías.
- Las fotografías se obtuvieron de Wikimedia Commons y se recortaron para el
  sitio. Verifica la licencia de cada recurso antes de una publicación
  comercial.
- Los logotipos de Visa, Mastercard y Octano se muestran solo como métodos de
  pago aceptados.

## Compilación

```bash
npm run build
npm start
```
