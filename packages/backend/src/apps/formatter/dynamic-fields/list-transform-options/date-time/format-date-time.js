import formatOptions from './options/format.js';
import timezoneOptions from './options/timezone.js';

const formatDateTime = [
  {
    label: 'Input',
    key: 'input',
    type: 'string',
    required: true,
    description: 'The datetime you want to format.',
    variables: true,
  },
  {
    label: 'From Format',
    key: 'fromFormat',
    type: 'dropdown',
    required: true,
    description: 'The format of the input.',
    variables: true,
    options: formatOptions,
  },
  {
    label: 'From Timezone',
    key: 'fromTimezone',
    type: 'dropdown',
    required: true,
    description: 'The timezone of the input.',
    variables: true,
    options: timezoneOptions,
  },
  {
    label: 'To Format',
    key: 'toFormat',
    type: 'dropdown',
    required: true,
    description: 'The format of the output.',
    variables: true,
    options: formatOptions,
  },
  {
    label: 'To Timezone',
    key: 'toTimezone',
    type: 'dropdown',
    required: true,
    description: 'The timezone of the output.',
    variables: true,
    options: timezoneOptions,
  },
];

export default formatDateTime;
