import { UserOptions } from '../types';
import assert from './assert';

function assertValidUserOptions(options: UserOptions): void {
  assert(typeof options.email === 'string', 'email must be a string');
  assert(Array.isArray(options.domains), 'domains must be an array');
  assert(
    Array.isArray(options.topLevelDomains),
    'topLevelDomains must be an array'
  );
  assert(
    Array.isArray(options.secondLevelDomains),
    'secondLevelDomains must be an array'
  );
  assert(
    typeof options.distanceFunction === 'function',
    'distanceFunction must be a function'
  );
}

export default assertValidUserOptions;
