import appConfig from './app'

const corsOptions = {
  origin: `${appConfig.protocol}://${appConfig.host}:${appConfig.corsPort}`,
  methods: 'POST',
  credentials: true,
  optionsSuccessStatus: 200,
}

export default corsOptions;
