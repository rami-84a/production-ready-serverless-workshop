const CorrelationIds = require('./correlation-ids');
const LogLevels = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const DEFAULT_CONTEXT = {
  awsRegion: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
  functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
  functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
  functionMemorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
  stage: process.env.ENVIRONMENT || process.env.STAGE
}

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

function getContext () {
  // if there's a global variable for all the current request context then use it
  const context = CorrelationIds.get()
  if (context) {
    // note: this is a shallow copy, which is ok as we're not going to mutate anything
    return Object.assign({}, DEFAULT_CONTEXT, context)
  }

  return DEFAULT_CONTEXT
}

function log (levelName, message, params) {
  if (!isEnabled(LogLevels[levelName])) {
    return
  }

  let context = getContext()
  let logMsg = Object.assign({}, context, params)
  logMsg.level = levelName
  logMsg.message = message

  console.log(JSON.stringify(logMsg))
}

module.exports = {
  debug: (msg, params) => log('DEBUG', msg, params),
  info: (msg, params) => log('INFO', msg, params),
  warn: (msg, params, err) => log('WARN', msg, appendError(params, err)),
  error: (msg, params, err) => log('ERROR', msg, appendError(params, err)),
  enableDebug
};