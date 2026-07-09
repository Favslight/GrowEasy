export const formatStatusLabel = (status: string): string => {
  if (!status.trim()) {
    return '—';
  }
  return status
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');
};

export const formatDataSourceLabel = (source: string): string => {
  if (!source.trim()) {
    return '—';
  }
  return source
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');
};

export const formatMobile = (countryCode: string, mobile: string): string => {
  const code = countryCode.trim();
  const number = mobile.trim();
  if (!number) {
    return '—';
  }
  return code ? `${code} ${number}` : number;
};
