export const flagApi = ({ src, width }: { src: string; width: number }) => {
  return `https://flagsapi.com/${src}/flat/${width}.png`;
};
