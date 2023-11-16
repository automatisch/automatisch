import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Remove Image Background',
  key: 'removeImageBackground',
  description:
    'Removes the background of an image.',
    arguments: [
      {
        label: 'Image file',
        key: 'imageFile',
        type: 'string' as const,
        required: true,
        variables: true,
        description: 'Provide a JPG or PNG file, up to 12 MB (see remove.bg/supported-images)', 
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
        label: 'Add background color',
        key: 'bgColor',
        type: 'string' as const,
        description: 'Can be a hex color code (e.g. 81d4fa, fff) or a color name (e.g. green)',
        required: false,
      },
      {
        label: 'Add background image URL',
        key: 'bgImage',
        type: 'string' as const,
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
          { label: 'ZIP', value: 'zip'}
        ]
      }
    ],
    async run($) {
      const imageFile = $.step.parameters.imageFile as string;
      const size = $.step.parameters.size as string;
      const bgColor = $.step.parameters.bgColor as string;
      const bgImage = $.step.parameters.bgImage as string;
      const outputFormat = $.step.parameters.outputFormat as string;

      const body = JSON.stringify({ 
        image_file_b64: imageFile,
        size: size,
        bg_Color: bgColor,
        bg_image_url: bgImage,
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
})