
/**
 * Sort an array of strings in descending order based on numeric values
 * */
export function sortDesc(input: string[]) {
  return input
    .slice()
    .sort((a: string, b: string) => Number(a) > Number(b) ? -1 : 1);
}

/**
 * Returns a deduped copy of an array of strings
 * */
export function deduped(input: string[]) {
  return input
    .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
}