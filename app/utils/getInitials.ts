/**
 * returns the first two characters of a user's name
 * @param name string
 * @returns string
 */
export default function (name: string, toUpperCase = true) {
  if (!name) {
    return ''
  } // Handle empty input

  const words = name.trim().split(/\s+/) // Split by spaces
  const firstWord = words[0] ?? ''
  const secondWord = words[1]
  const initials = secondWord
    ? `${firstWord[0] ?? ''}${secondWord[0] ?? ''}` // First character of first and second word
    : `${firstWord[0] ?? ''}${firstWord[firstWord.length - 1] ?? ''}` // First and last character if one word}

  return toUpperCase ? initials.toUpperCase() : initials
}
