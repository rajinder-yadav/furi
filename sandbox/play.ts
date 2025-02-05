import { fastPathMatch } from './fast_match.ts';
// const key = 'aa/([\\w-.~]+)/bb/([\\w-.~]+)/cc';
// const str = '/aa/max-12/bb/min/cc';

// const pat = RegExp(key);
// const match = pat.exec(str);
// if (match) {
//   // console.log(match); // Output: /aa/max/bb/min/cc
//   console.log(match[1]); // Output: 123
//   console.log(match[2]); // Output: 456
// } else {
//   console.log('No match found');
// }

const path = '/aa/max-12/bb/min/cc';
const key = '/aa/:one/bb/:two/cc';

if (fastPathMatch(path, key)) {
  console.log("Did match");
} else {
  console.log("Did not match");
}
