// Remote logger utility for browser-side logging to a remote endpoint
import axios from 'axios';

const REMOTE_LOG_URL = import.meta.env.VITE_REMOTE_LOG_URL || 'http://localhost:8811/logs';

/**
 * Log a message to the remote logging endpoint.
 * @param {string} level - log level: 'info', 'warn', 'error'
 * @param {string} context - context of the log (e.g., 'LoginPage')
 * @param {string|object} message - error or message to log
 */
export async function remoteLog(level, context, message) {
  try {
    await axios.post(REMOTE_LOG_URL, {
      level,
      context,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[RemoteLogger] Failed to send log:', err);
  }
}

/**
 * Convenience wrappers
 */
export const remoteLogInfo = (context, message) => remoteLog('info', context, message);
export const remoteLogWarn = (context, message) => remoteLog('warn', context, message);
export const remoteLogError = (context, message) => remoteLog('error', context, message);
