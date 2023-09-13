const htmlToMarkdown = [
  {
    label: 'Input',
    key: 'input',
    type: 'string' as const,
    required: true,
    description: 'HTML that will be converted to Markdown.',
    variables: true,
  },
];

export default htmlToMarkdown;
