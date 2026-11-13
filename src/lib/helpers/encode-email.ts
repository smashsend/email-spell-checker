// Percent-encode the email address, but leave in valid characters, following
// this official spec:
// http://en.wikipedia.org/wiki/Email_address#Syntax
//
// We have to replace all the possible characters.
// that's why we use a regex with a global flag.
//
// NOTE: this is NOT HTML escaping. Characters like ' and & pass through, so
// callers must still escape suggestions before inserting them into HTML.
//
// Returns undefined for strings encodeURI rejects (lone UTF-16 surrogates),
// which would otherwise throw a URIError on user input.
function encodeEmail(email: string): string | undefined {
  let encoded: string;
  try {
    encoded = encodeURI(email);
  } catch {
    return undefined;
  }
  const result = encoded
    .replace(/%20/g, ' ')
    .replace(/%25/g, '%')
    .replace(/%5E/g, '^')
    .replace(/%60/g, '`')
    .replace(/%7B/g, '{')
    .replace(/%7C/g, '|')
    .replace(/%7D/g, '}');
  return result;
}

export default encodeEmail;
