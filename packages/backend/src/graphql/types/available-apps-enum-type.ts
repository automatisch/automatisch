import type { IApp } from '@automatisch/types';
import { GraphQLEnumType } from 'graphql';
import App from '../../models/app';

const apps = App.findAll();
const availableAppEnumValues: any = {}

apps.forEach((app: IApp) => {
  availableAppEnumValues[app.key] = { value: app.key }
})

const availableAppsEnumType = new GraphQLEnumType({
  name: 'AvailableAppsEnumType',
  values: availableAppEnumValues
})

export default availableAppsEnumType;
