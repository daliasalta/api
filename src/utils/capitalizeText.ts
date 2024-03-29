export function capitalizeText(name: string) {
  const words = name.split(" ");

  const pascalCaseWords = words.map((word) => {
    const capitalizedWord =
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return capitalizedWord;
  });

  return pascalCaseWords.join(" ");
}
