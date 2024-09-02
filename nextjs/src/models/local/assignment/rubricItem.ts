export interface RubricItem {
  label: string;
  points: number;
}


export const rubricItemIsExtraCredit = (item: RubricItem) => {
  const extraCredit = '(extra credit)';
  return item.label.toLowerCase().includes(extraCredit.toLowerCase());
}