export const shortenLargeTexts = (text: string, limitIndex: number): string => {
  let shortVersion = text;

  if (text.length > limitIndex)
    shortVersion = text.substring(0, limitIndex) + "...";

  return shortVersion;
};

export const dateToString = (date: Date, showYear?: boolean): string => {
  const day = formatWithLeadingZero(date.getDate());
  const month = formatWithLeadingZero(date.getMonth() + 1);

  return showYear
    ? `${day}/${month}/${date.getUTCFullYear()}`
    : `${day}/${month}`;
};

export const compareQueryStrings = (string1: string, string2: string): boolean => {
  return string1.toLowerCase().includes(string2.toLowerCase())
}

export const formatWithLeadingZero = (number: number) =>
  number < 10 ? `0${number}` : number.toString();

export const MONTH_LABELS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
