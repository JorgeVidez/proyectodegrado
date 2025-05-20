import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig = {
  /* config options here */
  distDir: "build",
  reactStrictMode: true,
  compiler: { removeConsole: process.env.NODE_ENV === "production" },
};

// Configuración del plugin next-pwa
const pwaOptions = {
  dest: "public", // Directorio donde se generará el Service Worker (sw.js, workbox-*.js)
  // Deshabilitar PWA en modo de desarrollo.
  // Esto evita que el Service Worker cachee recursos y cause problemas
  // con la recarga en caliente (hot reloading) o cambios de código durante el desarrollo.
  // La PWA se habilitará automáticamente cuando construyas para producción (NODE_ENV='production').
  disable: process.env.NODE_ENV === "development", // <-- Cambiado a 'development'

  register: true, // Registra automáticamente el Service Worker
  skipWaiting: true, // Instala el Service Worker inmediatamente, útil para actualizaciones rápidas

  // Agrega otras opciones de next-pwa si las necesitas (por ejemplo, runtimeCaching)
};

// Aplica el withPWA directamente a la configuración
export default withPWA(pwaOptions)(nextConfig);
