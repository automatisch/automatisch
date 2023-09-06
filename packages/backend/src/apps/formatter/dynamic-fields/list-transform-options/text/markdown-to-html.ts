const markdownToHtml = [
  {
    label: 'Input',
    key: 'input',
    type: 'string' as const,
    required: true,
    description: 'Markdown text that will be converted to HTML.',
    variables: true,
  },
];

export default markdownToHtml;
