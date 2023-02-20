import appConfig from './app';

const corsOptions = {
  origin: appConfig.appEnv != 'development' ? appConfig.webAppUrl : /.*/,
  methods: 'POST',
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
