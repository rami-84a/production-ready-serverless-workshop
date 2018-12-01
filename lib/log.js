const LogLevels = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const logLevelName = () => process.env.log_level || 'DEBUG';
const isEnabled = level => level >= LogLevels[logLevelName()];

function appendError(params, err) {
  if (!err) {
    return params;
  }

  return Object.assign(
    {},
    params || {},
    { errorName: err.name, errorMessage: err.message, stackTrace: err.stack }
  )
}

function enableDebug() {
  const oldLevel = process.env.log_level
  process.env.log_level = 'DEBUG'

  return () => {
    process.env.log_level = oldLevel
  }
}

function log (levelName, message, params) {
  if (!isEnabled(LogLevels[levelName])) {
    return
  }

  let logMsg = Object.assign({}, params);
  logMsg.level = levelName;
  logMsg.message = message;

  console.log(JSON.stringify(logMsg));
}

module.exports = {
  debug: (msg, params) => log('DEBUG', msg, params),
  info: (msg, params) => log('INFO', msg, params),
  warn: (msg, params, err) => log('WARN', msg, appendError(params, err)),
  error: (msg, params, err) => log('ERROR', msg, appendError(params, err)),
  enableDebug
};