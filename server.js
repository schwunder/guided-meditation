import { readdir } from 'node:fs/promises';

Bun.serve({
  port: 8080,
  async fetch(request) {
    const urlPath = new URL(request.url).pathname;

    if (urlPath === '/api/assets') {
      const allFiles = await readdir('./public/assets');
      const assetFiles = allFiles.filter(filename => !filename.startsWith('.'));
      return Response.json(assetFiles);
    }

    if (urlPath === '/' || urlPath === '/assets') {
      const indexFile = Bun.file('./public/index.html');
      return new Response(indexFile);
    }

    const staticPath = decodeURIComponent(urlPath);
    const staticFile = Bun.file(`./public${staticPath}`);
    const fileExists = await staticFile.exists();

    if (fileExists) {
      return new Response(staticFile);
    }

    return new Response('Not Found', { status: 404 });
  }
});
