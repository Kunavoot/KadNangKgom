import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/~std660102/KadNangKgom/",
  plugins: [
    react(),
    tailwindcss(),
  ],
});