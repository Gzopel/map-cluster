module.exports = {
    baseUrl:'http://localhost',
    port:8000,
    mongoHost:"mongodb://"+(process.env.MONGO_HOST || 'localhost')+"/rabbits"
}
