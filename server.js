Bun.serve({
  port: 8080,
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/assets') {
      const files = await Bun.readdir('./public/assets');
      return Response.json(files.filter(f => !f.startsWith('.')));
    }

    if (pathname === '/') {
      return new Response(Bun.file('./public/index.html'));
    }

    if (pathname === '/main.js') {
      return new Response(Bun.file('./public/main.js'));
    }

    if (pathname.startsWith('/assets/')) {
      const assetPath = decodeURIComponent(pathname);
      return new Response(Bun.file(`./public${assetPath}`));
    }

    return new Response('Not Found', { status: 404 });
  }
});
