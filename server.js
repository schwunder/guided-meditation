const PUBLIC_ROOT = './public';

const servePublicFile = async (pathname) => {
  if (!pathname || pathname.includes('..')) {
    return null;
  }

  const normalized = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  if (!normalized) {
    return null;
  }

  const file = Bun.file(`${PUBLIC_ROOT}/${normalized}`);
  if (await file.exists()) {
    return new Response(file);
  }

  return null;
};

Bun.serve({
  port: 8080,
  async fetch(request) {
    const { pathname } = new URL(request.url);

    if (pathname === '/' || pathname === '') {
      return new Response(Bun.file(`${PUBLIC_ROOT}/index.html`));
    }

    const explicitStatic = {
      '/main.js': 'main.js',
      '/sequence.json': 'sequence.json',
      '/checkpoint-metadata.json': 'checkpoint-metadata.json',
    };

    if (pathname in explicitStatic) {
      return new Response(Bun.file(`${PUBLIC_ROOT}/${explicitStatic[pathname]}`));
    }

    if (pathname.startsWith('/assets/')) {
      return new Response(Bun.file(`${PUBLIC_ROOT}${pathname}`));
    }

    if (pathname.endsWith('.json')) {
      const response = await servePublicFile(pathname);
      if (response) {
        return response;
      }
    }

    const fallback = await servePublicFile(pathname);
    if (fallback) {
      return fallback;
    }

    return new Response('Not Found', { status: 404 });
  },
});
