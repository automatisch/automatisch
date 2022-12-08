export const generateExternalLink = (link: string) => (str: string) =>
  (
    <a href={link} target="_blank">
      {str}
    </a>
  );
