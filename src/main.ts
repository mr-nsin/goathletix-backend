import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setGlobalDispatcher, ProxyAgent } from 'undici';

const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;
if (proxyUrl) {
  // Node's native fetch (used by @supabase/supabase-js) doesn't read HTTP_PROXY/HTTPS_PROXY
  // on its own, unlike curl — route it through the corporate proxy explicitly.
  setGlobalDispatcher(new ProxyAgent(proxyUrl));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

