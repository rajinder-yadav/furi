/**
 * Fast path matching algorithm
 * @param path - The path to match against the key
 * @param key - The key to match against the path
 * @returns true if the path matches the key, false otherwise
 */
export function fastPathMatch(path: string, key: string): boolean {
  const pathNames = path.split('/');
  const keyName = key.split('/')

  console.log(pathNames);
  console.log(keyName);

  let didMatch: boolean = true;
  if (keyName.length === pathNames.length) {
    console.log('Equal tokens');
    for (let i = pathNames.length - 1; i > 0; i--) {
      if (pathNames[i] !== keyName[i] && keyName[i][0] !== ':') {
        didMatch = false;
        break;
      } else {
        if (keyName[i][0] === ':') {
          console.log(`param ${keyName[i]}=${pathNames[i]}`);
        }
      }
    }
  } else {
    didMatch = false;
  }
  return didMatch;
}
