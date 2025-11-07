Bun.serve({
  port: 8080,
  async fetch(request) {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/assets') {
      const files = await Bun.readdir('./public/assets');
      return Response.json(files.filter(f => !f.startsWith('.')));
    }

    let filePath = decodeURIComponent(pathname);
    if (pathname === '/') {
      filePath = '/index.html';
    }
    const file = Bun.file(`./public${filePath}`);
    
    if (await file.exists()) {
      return new Response(file);
    }
    
    return new Response('Not Found', { status: 404 });
  }
});
