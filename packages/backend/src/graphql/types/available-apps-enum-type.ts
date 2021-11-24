import { GraphQLEnumType } from 'graphql';
import App from '../../models/app';
import appInfoType from '../../types/app-info'

const apps = App.findAll();
const availableAppEnumValues: any = {}

apps.forEach((app: appInfoType) => {
  availableAppEnumValues[app.key] = { value: app.key }
})

const availableAppsEnumType = new GraphQLEnumType({
  name: 'AvailableAppsEnumType',
  values: availableAppEnumValues
})

export default availableAppsEnumType;
