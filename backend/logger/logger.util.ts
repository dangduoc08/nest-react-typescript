export class Colorize {
  protected static green = (text: string | number): string => `\x1b[32m${text}\x1b[0m`
  protected static yellow = (text: string | number): string => `\x1b[33m${text}\x1b[0m`
  protected static red = (text: string | number): string => `\x1b[31m${text}\x1b[0m`
  protected static dim = (text: string | number): string => `\x1b[2m${text}\x1b[0m`
}