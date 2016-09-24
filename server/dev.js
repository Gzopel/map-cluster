module.exports = {
  baseUrl: 'http://' + (process.env.HOST_NAME || 'localhost'),
  port: 8000,
  mongoHost: 'mongodb://' + (process.env.MONGO_HOST || 'localhost') + '/rabbits',
}
