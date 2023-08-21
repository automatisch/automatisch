import Variable from './Variable';

export default function Element(props: any) {
  const { attributes, children, element, disabled } = props;

  switch (element.type) {
    case 'variable':
      return <Variable {...props} disabled={disabled} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
}
