import slugify from 'slugify';

const formSerializer = (form) => {
  const formData = {
    id: form.id,
    name: form.name,
    fields: form?.steps[0]?.parameters?.fields?.map((parameter) => ({
      fieldKey: slugify(parameter.fieldName, {
        lower: true,
        strict: true,
        replacement: '-',
      }),
      fieldName: parameter.fieldName,
      fieldType: parameter.fieldType,
    })),
  };

  return formData;
};

export default formSerializer;
