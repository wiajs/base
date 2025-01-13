if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/base.cjs')
} else {
  module.exports = require('./dist/base.cjs')
}
