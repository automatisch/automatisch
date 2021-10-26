import App from '../models/app';
import appConfig from '../config/app';

if(appConfig.appEnv === 'development') {
  const apps = App.findAll();

  apps.forEach((app: any) => {
    import(`../apps/${app.key}`);
  })
}
