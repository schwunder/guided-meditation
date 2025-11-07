Bun.serve({
  port: 8080,
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === '/') {
      return new Response(Bun.file('./public/index.html'));
    }

    if (pathname === '/main.js') {
      return new Response(Bun.file('./public/main.js'));
    }

    if (pathname.startsWith('/assets/')) {
      return new Response(Bun.file(`./public${pathname}`));
    }

    return new Response('Not Found', { status: 404 });
  }
});
