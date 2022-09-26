export function parseHTML(string) {
  const parser = new DOMParser();
  return parser.parseFromString(string, "text/html").body.childNodes[0];
}

export function parseDateTime(string) {
  return string.substring(0, 16);
}
