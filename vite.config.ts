import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

// Dev-only: routes /api/news to api/news.ts so the Vercel serverless function
// also works under `npm run dev`. In production Vercel handles api/* itself.
const devApiNews = (): Plugin => ({
  name: 'dev-api-news',
  configureServer(server) {
    server.middlewares.use('/api/news', async (req, res) => {
      try {
        const mod = await server.ssrLoadModule('/api/news.ts');
        await mod.default(req, res);
      } catch (err) {
        console.error('[dev-api-news]', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({error: String(err)}));
      }
    });
  },
});

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), devApiNews()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
