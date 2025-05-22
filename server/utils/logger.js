const logger = {
  info: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      const timestamp = new Date().toISOString();
      process.stdout.write(`[INFO] ${timestamp}: ${message}\n`);
    }
  },
  error: (message, error) => {
    const timestamp = new Date().toISOString();
    process.stderr.write(`[ERROR] ${timestamp}: ${message}\n`);
    if (error && process.env.NODE_ENV !== 'production') {
      process.stderr.write(`${error.stack || error}\n`);
    }
  },
  warn: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      const timestamp = new Date().toISOString();
      process.stdout.write(`[WARN] ${timestamp}: ${message}\n`);
    }
  },
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      process.stdout.write(`[DEBUG] ${timestamp}: ${message}\n`);
    }
  }
};

module.exports = logger; 