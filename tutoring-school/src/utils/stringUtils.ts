export const shortenLargeTexts = (text: string, limitIndex: number): string => {
  let shortVersion = text;

  if (text.length > limitIndex)
    shortVersion = text.substring(0, limitIndex) + "...";

  return shortVersion;
};

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
