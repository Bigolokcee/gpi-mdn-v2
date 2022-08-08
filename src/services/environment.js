const config = {
    mode: 'prod',
    _devServerUrl: 'http://localhost:5500/',
    _devServerUrlWS: 'ws://localhost:5500/',
    _devDbUrl: 'mongodb://localhost:27017/gpi',
    _prodDbUrl: 'mongodb+srv://bigolo:bigolo@cluster0.fa9wf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    _prodServerUrl: 'https://warm-chamber-13731.herokuapp.com/',
    _prodServerUrlWS: 'wss://warm-chamber-13731.herokuapp.com/',
};

const _SERVER_URL = config.mode === 'dev' ? config._devServerUrl : config._prodServerUrl;
const _WS_URL = config.mode === 'dev' ? config._devServerUrlWS : config._prodServerUrlWS;
const _DB_URL = config.mode === 'dev' ? config._devDbUrl : config._prodDbUrl;
export {
    _SERVER_URL,
    _DB_URL,
    _WS_URL
};