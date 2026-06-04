/**
 * Logger condicional — Solo imprime en consola cuando estamos en modo desarrollo.
 * En producción, todos los logs se silencian para evitar exponer información interna.
 */
const isDev = import.meta.env.DEV;

const logger = {
  log: (...args) => {
    if (isDev) console.log(...args);
  },
  error: (...args) => {
    if (isDev) console.error(...args);
  },
  warn: (...args) => {
    if (isDev) console.warn(...args);
  },
  info: (...args) => {
    if (isDev) console.info(...args);
  },
};

export default logger;
