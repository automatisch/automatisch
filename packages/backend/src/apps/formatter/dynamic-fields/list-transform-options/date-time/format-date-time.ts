import formatOptions from './options/format';
import timezoneOptions from './options/timezone';

const formatDateTime = [
  {
    label: 'Input',
    key: 'input',
    type: 'string' as const,
    required: true,
    description: 'The datetime you want to format.',
    variables: true,
  },
  {
    label: 'From Format',
    key: 'fromFormat',
    type: 'dropdown' as const,
    required: true,
    description: 'The format of the input.',
    variables: true,
    options: formatOptions,
  },
  {
    label: 'From Timezone',
    key: 'fromTimezone',
    type: 'dropdown' as const,
    required: true,
    description: 'The timezone of the input.',
    variables: true,
    options: timezoneOptions,
  },
  {
    label: 'To Format',
    key: 'toFormat',
    type: 'dropdown' as const,
    required: true,
    description: 'The format of the output.',
    variables: true,
    options: formatOptions,
  },
  {
    label: 'To Timezone',
    key: 'toTimezone',
    type: 'dropdown' as const,
    required: true,
    description: 'The timezone of the output.',
    variables: true,
    options: timezoneOptions,
  },
];

export default formatDateTime;
