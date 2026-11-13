type DistanceFunction = (a: string, b: string, threshold?: number) => number;

interface MailSuggestion {
  address: string;
  domain: string;
  full: string;
}

interface UserOptions {
  email: string;
  domains?: string[];
  domainThreshold?: number;
  topLevelDomains?: string[];
  topLevelThreshold?: number;
  secondLevelDomains?: string[];
  secondLevelThreshold?: number;
  distanceFunction?: DistanceFunction;
  // Callbacks code. Totally optional
  suggested?: (suggestion?: MailSuggestion) => void;
  empty?: () => void;
}

interface Options {
  email: string;
  domains: string[];
  topLevelDomains: string[];
  secondLevelDomains: string[];
  distanceFunction: DistanceFunction;
  domainThreshold: number;
  secondLevelThreshold: number;
  topLevelThreshold: number;

  // Callbacks code. Totally optional
  suggested?: (suggestion?: MailSuggestion) => void;
  empty?: () => void;
}

interface EmailsPart {
  topLevelDomain: string;
  secondLevelDomain: string;
  domain: string;
  address: string;
}

export type {
  DistanceFunction,
  EmailsPart,
  MailSuggestion,
  Options,
  UserOptions,
};
