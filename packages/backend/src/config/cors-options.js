import appConfig from './app.js';

const corsOptions = {
  origin: appConfig.webAppUrl,
  methods: 'GET,HEAD,POST,PATCH,DELETE',
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
