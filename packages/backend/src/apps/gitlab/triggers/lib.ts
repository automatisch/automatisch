import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import Crypto from 'crypto';
import { GITLAB_EVENT_TYPE } from './types';
import appConfig from '../../../config/app';

export const projectArgumentDescriptor = {
  label: 'Project',
  key: 'projectId',
  type: 'dropdown' as const,
  required: true,
  description: 'Pick a project to receive events from',
  variables: false,
  source: {
    type: 'query',
    name: 'getDynamicData',
    arguments: [
      {
        name: 'key',
        value: 'listProjects',
      },
    ],
  },
};

export const getRunFn = async ($: IGlobalVariable) => {
  const dataItem = {
    raw: $.request.body,
    meta: {
      internalId: Crypto.randomUUID(),
    },
  };

  $.pushTriggerItem(dataItem);
};

export const getTestRunFn =
  (eventData: IJSONObject) => ($: IGlobalVariable) => {
    /*
      Not fetching actual events from gitlab and using static event data from documentation
      as there is no way to filter out events of one category using gitlab event types,
      filtering is very limited and uses different grouping than what is applicable when creating a webhook.

      ref:
        - https://docs.gitlab.com/ee/api/events.html#target-types
        - https://docs.gitlab.com/ee/api/projects.html#add-project-hook
    */

    if (!eventData) {
      return;
    }

    const dataItem = {
      raw: eventData,
      meta: {
        // there is no distinct id on gitlab event object thus creating it
        internalId: Crypto.randomUUID(),
      },
    };

    $.pushTriggerItem(dataItem);

    return Promise.resolve();
  };

export const getRegisterHookFn =
  (eventType: GITLAB_EVENT_TYPE) => async ($: IGlobalVariable) => {
    // ref: https://docs.gitlab.com/ee/api/projects.html#add-project-hook

    const subscriptionPayload = {
      url: $.webhookUrl,
      token: appConfig.webhookSecretKey,
      enable_ssl_verification: true,
      [eventType]: true,
    };

    if (
      ['wildcard', 'regex'].includes(
        $.step.parameters.branch_filter_strategy as string
      )
    ) {
      subscriptionPayload.branch_filter_strategy = $.step.parameters
        .branch_filter_strategy as string;
      subscriptionPayload.push_events_branch_filter = $.step.parameters
        .push_events_branch_filter as string;
    }

    const { data } = await $.http.post(
      `/api/v4/projects/${$.step.parameters.projectId}/hooks`,
      subscriptionPayload
    );

    await $.flow.setRemoteWebhookId(data.id.toString());
  };

export const unregisterHook = async ($: IGlobalVariable) => {
  // ref: https://docs.gitlab.com/ee/api/projects.html#delete-project-hook
  await $.http.delete(
    `/api/v4/projects/${$.step.parameters.projectId}/hooks/${$.flow.remoteWebhookId}`
  );
};
