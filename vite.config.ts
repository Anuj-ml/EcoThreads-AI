
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Maps Vercel Environment Variables to "process.env" in the browser code.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.API_KEY_1': JSON.stringify(env.API_KEY_1),
      'process.env.API_KEY_2': JSON.stringify(env.API_KEY_2)
    }
  };
});
