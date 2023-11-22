import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Remove image background',
  key: 'removeImageBackground',
  description:
    'Removes the background of an image.',
  arguments: [
    {
      label: 'Image file',
      key: 'imageFileB64',
      type: 'string' as const,
      required: true,
      variables: true,
      description: 'Provide a JPG or PNG file in Base64 format, up to 12 MB (see remove.bg/supported-images)',
    },
    {
      label: 'Size',
      key: 'size',
      type: 'dropdown' as const,
      required: true,
      value: 'auto',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Preview (up to 0.25 megapixels)', value: 'preview' },
        { label: 'Full (up to 10 megapixels)', value: 'full' },
      ]
    },
    {
      label: 'Background color',
      key: 'bgColor',
      type: 'string' as const,
      description: 'Adds a solid color background. Can be a hex color code (e.g. 81d4fa, fff) or a color name (e.g. green)',
      required: false,
    },
    {
      label: 'Background image URL',
      key: 'bgImageUrl',
      type: 'string' as const,
      description: 'Adds a background image from a URL.',
      required: false,
    },
    {
      label: 'Output image format',
      key: 'outputFormat',
      type: 'dropdown' as const,
      description: 'Note: Use PNG to preserve transparency',
      required: true,
      value: 'auto',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'PNG', value: 'png' },
        { label: 'JPG', value: 'jpg' },
        { label: 'ZIP', value: 'zip' }
      ]
    }
  ],
  async run($) {
    const imageFileB64 = $.step.parameters.imageFileB64 as string;
    const size = $.step.parameters.size as string;
    const bgColor = $.step.parameters.bgColor as string;
    const bgImageUrl = $.step.parameters.bgImageUrl as string;
    const outputFormat = $.step.parameters.outputFormat as string;

    const body = JSON.stringify({
      image_file_b64: imageFileB64,
      size: size,
      bg_color: bgColor,
      bg_image_url: bgImageUrl,
      format: outputFormat
    });

    const response = await $.http.post('/removebg', body, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    $.setActionItem({ raw: response.data });
  }
});
