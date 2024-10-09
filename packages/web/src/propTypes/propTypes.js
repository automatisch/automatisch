import PropTypes from 'prop-types';

export const JSONValuePropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.bool,
  PropTypes.object,
  PropTypes.array,
]);

export const AuthenticationStepFieldPropType = PropTypes.shape({
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string]),
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
});

export const AuthenticationStepPropType = PropTypes.shape({
  type: PropTypes.oneOf(['mutation', 'openWithPopup']),
  name: PropTypes.string,
  arguments: PropTypes.arrayOf(AuthenticationStepFieldPropType),
});

export const FieldTextPropType = PropTypes.shape({
  key: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.oneOf(['string']),
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  value: PropTypes.string,
  placeholder: PropTypes.oneOfType([PropTypes.string]),
  description: PropTypes.string,
  docUrl: PropTypes.string,
  clickToCopy: PropTypes.bool,
  variables: PropTypes.bool,
  dependsOn: PropTypes.arrayOf(PropTypes.string),
});

export const FieldDropdownSourcePropType = PropTypes.shape({
  type: PropTypes.string,
  name: PropTypes.string,
  arguments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
});

export const FieldDropdownAdditionalFieldsPropType = PropTypes.shape({
  type: PropTypes.string,
  name: PropTypes.string,
  arguments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
});

export const FieldDropdownOptionPropType = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
});

export const FieldDropdownPropType = PropTypes.shape({
  key: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.oneOf(['dropdown']),
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  placeholder: PropTypes.oneOfType([PropTypes.string]),
  description: PropTypes.string,
  docUrl: PropTypes.string,
  clickToCopy: PropTypes.bool,
  variables: PropTypes.bool,
  dependsOn: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.arrayOf(FieldDropdownOptionPropType),
  source: FieldDropdownSourcePropType,
  additionalFields: FieldDropdownAdditionalFieldsPropType,
});

export const FieldsPropType = PropTypes.arrayOf(
  PropTypes.oneOfType([FieldDropdownPropType, FieldTextPropType]),
);

export const FieldDynamicPropType = PropTypes.shape({
  key: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.oneOf(['dynamic']),
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  description: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.object),
  fields: FieldsPropType,
});

export const FieldPropType = PropTypes.oneOfType([
  FieldDropdownPropType,
  FieldTextPropType,
  FieldDynamicPropType,
]);

export const SubstepPropType = PropTypes.shape({
  key: PropTypes.string,
  name: PropTypes.string,
  arguments: PropTypes.arrayOf(FieldPropType),
});

export const RawTriggerPropType = PropTypes.shape({
  name: PropTypes.string,
  key: PropTypes.string,
  type: PropTypes.oneOf(['webhook', 'polling']),
  showWebhookUrl: PropTypes.bool,
  pollInterval: PropTypes.number,
  description: PropTypes.string,
  useSingletonWebhook: PropTypes.bool,
  singletonWebhookRefValueParameter: PropTypes.string,
  getInterval: PropTypes.func,
  run: PropTypes.func,
  testRun: PropTypes.func,
  registerHook: PropTypes.func,
  unregisterHook: PropTypes.func,
  arguments: PropTypes.arrayOf(FieldPropType),
});

export const TriggerPropType = PropTypes.shape({
  name: PropTypes.string,
  key: PropTypes.string,
  type: PropTypes.oneOf(['webhook', 'polling']),
  showWebhookUrl: PropTypes.bool,
  pollInterval: PropTypes.number,
  description: PropTypes.string,
  useSingletonWebhook: PropTypes.bool,
  singletonWebhookRefValueParameter: PropTypes.string,
  getInterval: PropTypes.func,
  run: PropTypes.func,
  testRun: PropTypes.func,
  registerHook: PropTypes.func,
  unregisterHook: PropTypes.func,
  substeps: PropTypes.arrayOf(SubstepPropType),
});

export const RawActionPropType = PropTypes.shape({
  name: PropTypes.string,
  key: PropTypes.string,
  description: PropTypes.string,
  run: PropTypes.func,
  arguments: PropTypes.arrayOf(FieldPropType),
});

export const ActionPropType = PropTypes.shape({
  name: PropTypes.string,
  key: PropTypes.string,
  description: PropTypes.string,
  run: PropTypes.func,
  substeps: PropTypes.arrayOf(SubstepPropType),
});

export const AuthPropType = PropTypes.shape({
  generateAuthUrl: PropTypes.func,
  verifyCredentials: PropTypes.func,
  isStillVerified: PropTypes.func,
  refreshToken: PropTypes.func,
  verifyWebhook: PropTypes.func,
  isRefreshTokenRequested: PropTypes.bool,
  fields: PropTypes.arrayOf(FieldPropType),
  authenticationSteps: PropTypes.arrayOf(AuthenticationStepPropType),
  reconnectionSteps: PropTypes.arrayOf(AuthenticationStepPropType),
  sharedAuthenticationSteps: PropTypes.arrayOf(AuthenticationStepPropType),
  sharedReconnectionSteps: PropTypes.arrayOf(AuthenticationStepPropType),
});

export const AppPropType = PropTypes.shape({
  name: PropTypes.string,
  key: PropTypes.string,
  iconUrl: PropTypes.string,
  docUrl: PropTypes.string,
  authDocUrl: PropTypes.string,
  primaryColor: PropTypes.string,
  supportsConnections: PropTypes.bool,
  apiBaseUrl: PropTypes.string,
  baseUrl: PropTypes.string,
  auth: AuthPropType,
  connectionCount: PropTypes.number,
  flowCount: PropTypes.number,
  beforeRequest: PropTypes.arrayOf(PropTypes.func),
  dynamicData: PropTypes.object,
  dynamicFields: PropTypes.object,
  triggers: PropTypes.arrayOf(TriggerPropType),
  actions: PropTypes.arrayOf(ActionPropType),
});

export const ConnectionPropType = PropTypes.shape({
  id: PropTypes.string,
  key: PropTypes.string,
  data: PropTypes.string,
  formattedData: PropTypes.object,
  userId: PropTypes.string,
  verified: PropTypes.bool,
  count: PropTypes.number,
  flowCount: PropTypes.number,
  appData: AppPropType,
  createdAt: PropTypes.number,
  reconnectable: PropTypes.bool,
  appAuthClientId: PropTypes.string,
});

AppPropType.connection = PropTypes.arrayOf(ConnectionPropType);

export const ExecutionStepPropType = PropTypes.shape({
  id: PropTypes.string,
  executionId: PropTypes.string,
  stepId: PropTypes.string,
  dataIn: PropTypes.object,
  dataOut: PropTypes.object,
  errorDetails: PropTypes.object,
  status: PropTypes.string,
  createdAt: PropTypes.number,
  updatedAt: PropTypes.number,
});

export const FlowPropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  userId: PropTypes.string,
  active: PropTypes.bool,
  status: PropTypes.oneOf(['paused', 'published', 'draft']),
  createdAt: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  updatedAt: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  remoteWebhookId: PropTypes.string,
  lastInternalId: PropTypes.func,
});

export const StepPropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  flowId: PropTypes.string,
  key: PropTypes.string,
  appKey: PropTypes.string,
  iconUrl: PropTypes.string,
  webhookUrl: PropTypes.string,
  type: PropTypes.oneOf(['action', 'trigger']),
  connectionId: PropTypes.string,
  status: PropTypes.string,
  position: PropTypes.number,
  parameters: PropTypes.object,
  connection: ConnectionPropType,
  flow: FlowPropType,
  executionSteps: PropTypes.arrayOf(ExecutionStepPropType),
  output: PropTypes.object,
  appData: AppPropType,
});

ExecutionStepPropType.step = StepPropType;
FlowPropType.steps = PropTypes.arrayOf(StepPropType);

export const ExecutionPropType = PropTypes.shape({
  id: PropTypes.string,
  flowId: PropTypes.string,
  flow: FlowPropType,
  testRun: PropTypes.bool,
  status: PropTypes.oneOf(['success', 'failure']),
  executionSteps: PropTypes.arrayOf(ExecutionStepPropType),
  updatedAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  createdAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
});

export const PermissionPropType = PropTypes.shape({
  id: PropTypes.string,
  action: PropTypes.string,
  subject: PropTypes.string,
  conditions: PropTypes.arrayOf(PropTypes.string),
});

export const RolePropType = PropTypes.shape({
  id: PropTypes.string,
  key: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  isAdmin: PropTypes.bool,
  permissions: PropTypes.arrayOf(PermissionPropType),
});

export const UserPropType = PropTypes.shape({
  id: PropTypes.string,
  fullName: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
  connections: PropTypes.arrayOf(ConnectionPropType),
  flows: PropTypes.arrayOf(FlowPropType),
  steps: PropTypes.arrayOf(StepPropType),
  role: RolePropType,
  permissions: PropTypes.arrayOf(PermissionPropType),
  createdAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  updatedAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  trialExpiryDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
});

export const PermissionCatalogPropType = PropTypes.shape({
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.string,
      subjects: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.string,
    }),
  ),
  conditions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.string,
    }),
  ),
});

export const ConfigPropType = PropTypes.shape({
  id: PropTypes.string,
  key: PropTypes.string,
  value: PropTypes.object,
});

export const TriggerItemPropType = PropTypes.shape({
  raw: PropTypes.object,
  meta: PropTypes.shape({
    internalId: PropTypes.string,
  }),
});

export const TriggerOutputPropType = PropTypes.shape({
  data: PropTypes.arrayOf(TriggerItemPropType),
  error: PropTypes.object,
});

export const ActionItemPropType = PropTypes.shape({
  raw: PropTypes.object,
});

export const IActionOutputPropType = PropTypes.shape({
  data: ActionItemPropType,
  error: PropTypes.object,
});

export const AuthenticationPropType = PropTypes.shape({
  client: PropTypes.any,
  verifyCredentials: PropTypes.func,
  isStillVerified: PropTypes.func,
});

export const PaymentPlanPropType = PropTypes.shape({
  price: PropTypes.string,
  name: PropTypes.string,
  limit: PropTypes.string,
  productId: PropTypes.string,
});

export const BillingTextCardActionPropType = PropTypes.shape({
  type: PropTypes.oneOf(['text']),
  text: PropTypes.string,
});

export const BillingLinkCardActionPropType = PropTypes.shape({
  type: PropTypes.oneOf(['link']),
  text: PropTypes.string,
  src: PropTypes.string,
});

export const BillingCardActionPropType = PropTypes.oneOfType([
  BillingTextCardActionPropType,
  BillingLinkCardActionPropType,
]);

export const SubscriptionPropType = PropTypes.shape({
  status: PropTypes.string,
  monthlyQuota: PropTypes.shape({
    title: PropTypes.string,
    action: BillingCardActionPropType,
  }),
  nextBillDate: PropTypes.shape({
    title: PropTypes.string,
    action: BillingCardActionPropType,
  }),
  nextBillAmount: PropTypes.shape({
    title: PropTypes.string,
    action: BillingCardActionPropType,
  }),
});

export const InvoicePropType = PropTypes.shape({
  id: PropTypes.number,
  amount: PropTypes.number,
  currency: PropTypes.string,
  payout_date: PropTypes.string,
  receipt_url: PropTypes.string,
});

export const SamlAuthProviderPropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  certificate: PropTypes.string,
  signatureAlgorithm: PropTypes.oneOf(['sha1', 'sha256', 'sha512']),
  issuer: PropTypes.string,
  entryPoint: PropTypes.string,
  firstnameAttributeName: PropTypes.string,
  surnameAttributeName: PropTypes.string,
  emailAttributeName: PropTypes.string,
  roleAttributeName: PropTypes.string,
  defaultRoleId: PropTypes.string,
  active: PropTypes.bool,
  loginUrl: PropTypes.string,
});

export const SamlAuthProviderRolePropType = PropTypes.shape({
  id: PropTypes.string,
  samlAuthProviderId: PropTypes.string,
  roleId: PropTypes.string,
  remoteRoleName: PropTypes.string,
});

export const AppConfigPropType = PropTypes.shape({
  id: PropTypes.string,
  key: PropTypes.string,
  allowCustomConnection: PropTypes.bool,
  connectionAllowed: PropTypes.bool,
  shared: PropTypes.bool,
  disabled: PropTypes.bool,
});

export const AppAuthClientPropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  appConfigId: PropTypes.string,
  authDefaults: PropTypes.string,
  formattedAuthDefaults: PropTypes.object,
  active: PropTypes.bool,
});

export const NotificationPropType = PropTypes.shape({
  name: PropTypes.string,
  createdAt: PropTypes.string,
  documentationUrl: PropTypes.string,
  description: PropTypes.string,
});
