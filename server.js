const PUBLIC_ROOT = './public';

Bun.serve({
  port: 8080,
  async fetch(request) {
    const { pathname } = new URL(request.url);

    if (pathname === '/' || pathname === '') {
      return new Response(Bun.file(`${PUBLIC_ROOT}/index.html`));
    }

    if (pathname.startsWith('/assets/')) {
      return new Response(Bun.file(`${PUBLIC_ROOT}${pathname}`));
    }

    return new Response('Not Found', { status: 404 });
  },
});
