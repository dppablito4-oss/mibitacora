/**
 * Logger condicional — Solo imprime en consola cuando estamos en modo desarrollo.
 * En producción, los logs se silencian para evitar exponer información interna.
 * Los errores en producción se registran en un stub preparado para conectar
 * con un servicio de monitoreo (Sentry, LogRocket, etc.) en el futuro.
 */
const isDev = import.meta.env.DEV;

/**
 * Stub para enviar errores a un servicio de monitoreo en producción.
 * Reemplazar con la integración real cuando se configure el servicio.
 * Ejemplo con Sentry: Sentry.captureException(new Error(args.join(' ')));
 */
// eslint-disable-next-line no-unused-vars
const reportToMonitoring = (...args) => {
  // TODO: Conectar con Sentry, LogRocket, o servicio similar
  // Por ahora, no-op en producción
};

const logger = {
  log: (...args) => {
    if (isDev) console.log(...args);
  },
  error: (...args) => {
    if (isDev) {
      console.error(...args);
    } else {
      // En producción, los errores se envían al servicio de monitoreo
      reportToMonitoring(...args);
    }
  },
  warn: (...args) => {
    if (isDev) console.warn(...args);
  },
  info: (...args) => {
    if (isDev) console.info(...args);
  },
};

export default logger;
