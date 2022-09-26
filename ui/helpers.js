export function parseHTML(string) {
  const parser = new DOMParser();
  return parser.parseFromString(string, "text/html").body.childNodes[0];
}
