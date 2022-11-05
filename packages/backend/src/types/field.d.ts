type Field = {
  key: string;
  label: string;
  type: string;
  required: boolean;
  readOnly: boolean;
  value: string;
  placeholder: string | null;
  description: string;
  docUrl: string;
  clickToCopy: boolean;
};

export default Field;
