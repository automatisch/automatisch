import appConfig from './app.js';

const corsOptions = {
  origin: appConfig.webAppUrl,
  methods: 'POST',
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
