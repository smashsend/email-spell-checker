import run from './lib/run';
import { POPULAR_DOMAINS, POPULAR_SLDS, POPULAR_TLDS } from './lib/config';

const MailSpellChecker = {
  run,
  POPULAR_DOMAINS,
  POPULAR_SLDS,
  POPULAR_TLDS,
};

export { run, POPULAR_DOMAINS, POPULAR_SLDS, POPULAR_TLDS };
export default MailSpellChecker;
