import { DEFAULT_CONFIG } from '../config';
import { Options, UserOptions } from '../types';

function getOptions(userOptions: UserOptions): Options {
  return {
    email: userOptions.email,
    domains: userOptions.domains || DEFAULT_CONFIG.domains,
    topLevelDomains:
      userOptions.topLevelDomains || DEFAULT_CONFIG.topLevelDomains,
    secondLevelDomains:
      userOptions.secondLevelDomains || DEFAULT_CONFIG.secondLevelDomains,
    distanceFunction:
      userOptions.distanceFunction || DEFAULT_CONFIG.distanceFunction,
    domainThreshold:
      userOptions.domainThreshold || DEFAULT_CONFIG.domainThreshold,
    secondLevelThreshold:
      userOptions.secondLevelThreshold || DEFAULT_CONFIG.secondLevelThreshold,
    topLevelThreshold:
      userOptions.topLevelThreshold || DEFAULT_CONFIG.topLevelThreshold,
    suggested: userOptions.suggested || undefined,
    empty: userOptions.empty || undefined,
  };
}

export default getOptions;
