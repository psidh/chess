export function getColor(): string[] {
  return Math.random() > 0.5 ? ['white', 'black'] : ['black', 'white'];
}
