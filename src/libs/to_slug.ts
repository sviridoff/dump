// https://gist.github.com/codeguy/6684588#gistcomment-3974852
export function toSlug(text: string) {
  return text
    .toString()
    .normalize('NFD') // split an accented letter in the base letter and the accent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
    .trim()
    .replace(/\s+/g, '-');
}
