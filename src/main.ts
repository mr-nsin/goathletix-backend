// Must stay first. The proxy block below reads process.env at module-load time, which happens
// BEFORE ConfigModule loads .env — so without this, HTTPS_PROXY could never come from .env and
// every Supabase call failed with `TypeError: fetch failed` on a proxied network.
//
// The path is resolved from __dirname, NOT process.cwd(): the dev server is launched as
// `npm run start:dev --prefix goathletix-backend`, so cwd is the workspace root, where no .env
// exists. __dirname is dist/ (or src/ under ts-node), and ../.env resolves correctly from both.
import { config as loadEnv } from 'dotenv';
import { join } from 'path';
import { getCACertificates } from 'tls';

loadEnv({ path: join(__dirname, '..', '.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setGlobalDispatcher, ProxyAgent } from 'undici';

const proxyUrl =
  process.env.HTTPS_PROXY ||
  process.env.https_proxy ||
  process.env.HTTP_PROXY ||
  process.env.http_proxy;
if (proxyUrl) {
  // Node's native fetch (used by @supabase/supabase-js) doesn't read HTTP_PROXY/HTTPS_PROXY
  // on its own, unlike curl — route it through the corporate proxy explicitly.
  //
  // The proxy also terminates TLS (Forcepoint interception), presenting a certificate signed by
  // a corporate root CA. That CA is trusted by Windows but NOT by Node, whose bundled store is
  // independent — which surfaced as an opaque `TypeError: fetch failed` whose only real detail
  // was `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`. Hand the tunnel Node's bundled roots PLUS the OS
  // trust store so the intercepting certificate validates properly.
  //
  // Deliberately NOT NODE_TLS_REJECT_UNAUTHORIZED=0: that disables verification everywhere.
  let ca: string[] | undefined;
  try {
    if (typeof getCACertificates === 'function') {
      ca = [...getCACertificates('bundled'), ...getCACertificates('system')];
    }
  } catch {
    ca = undefined; // Fall back to Node's defaults rather than failing to boot.
  }

  setGlobalDispatcher(
    new ProxyAgent({ uri: proxyUrl, ...(ca ? { requestTls: { ca } } : {}) }),
  );
  // Host only — never log the full URL, which may carry credentials.
  console.log(
    `[bootstrap] outbound proxy enabled: ${new URL(proxyUrl).host}` +
      (ca
        ? ` (trusting ${ca.length} CAs incl. OS store)`
        : ' (default CA store)'),
  );
} else {
  console.warn(
    '[bootstrap] NO outbound proxy configured. On a filtered network every Supabase ' +
      'call will fail with "TypeError: fetch failed". Set HTTPS_PROXY.',
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
