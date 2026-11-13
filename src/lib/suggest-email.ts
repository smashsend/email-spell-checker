import encodeEmail from './helpers/encode-email';
import findClosestDomain from './helpers/find-closest-domain';
import parseEmail from './helpers/parse-email';
import { MailSuggestion, Options } from './types';

const PREFERRED_TLD = { domain: 'com', bias: 0.75 };

function suggestEmail(opts: Options): MailSuggestion | undefined {
  const encodedEmail = encodeEmail(opts.email.toLowerCase());
  const email = parseEmail(encodedEmail);

  if (!email) {
    return undefined;
  }

  const {
    domains,
    domainThreshold,
    distanceFunction,
    secondLevelDomains,
    topLevelDomains,
  } = opts;

  if (secondLevelDomains && topLevelDomains) {
    // If the email is a valid 2nd-level + top-level, do not suggest anything.
    // if (hasValidSecondLevelDomain(email) && hasValidTopLevelDomain(email)) {
    if (
      secondLevelDomains.indexOf(email.secondLevelDomain) !== -1 &&
      topLevelDomains.indexOf(email.topLevelDomain) !== -1
    ) {
      return undefined;
    }
  }

  let closestDomain = findClosestDomain({
    domain: email.domain,
    domains,
    distanceFunction,
    threshold: domainThreshold,
  });

  if (closestDomain) {
    if (closestDomain == email.domain) {
      // The email address exactly matches one of the supplied domains; do not return a suggestion.
      return undefined;
    } else {
      // The email address closely matches one of the supplied domains; return a suggestion
      return {
        address: email.address,
        domain: closestDomain,
        full: email.address + '@' + closestDomain,
      };
    }
  }

  // The email address does not closely match one of the supplied domains
  const closestSecondLevelDomain = findClosestDomain({
    domain: email.secondLevelDomain,
    domains: secondLevelDomains,
    distanceFunction,
    threshold: opts.secondLevelThreshold,
  });
  const closestTopLevelDomain = findClosestDomain({
    domain: email.topLevelDomain,
    domains: topLevelDomains,
    distanceFunction,
    threshold: opts.topLevelThreshold,
    // .com is far more common than .co/.cn/.ca, so typos like ".con" or ".cin"
    // should resolve to it when it is a near tie.
    preferred:
      topLevelDomains.indexOf('com') !== -1 ? PREFERRED_TLD : undefined,
  });
  if (email.domain) {
    closestDomain = email.domain;
    let rtrn = false;

    if (
      closestSecondLevelDomain &&
      closestSecondLevelDomain != email.secondLevelDomain
    ) {
      // The email address may have a mispelled second-level domain; return a suggestion
      closestDomain = closestDomain.replace(
        email.secondLevelDomain,
        closestSecondLevelDomain
      );
      rtrn = true;
    }

    if (
      closestTopLevelDomain &&
      closestTopLevelDomain != email.topLevelDomain &&
      email.secondLevelDomain !== ''
    ) {
      // The email address may have a mispelled top-level domain; return a suggestion
      // Swap the trailing TLD with plain string ops. Building a RegExp from user
      // input throws on characters like ")" or "(" and misbehaves on "+" or ".".
      closestDomain =
        closestDomain.slice(
          0,
          closestDomain.length - email.topLevelDomain.length
        ) + closestTopLevelDomain;
      rtrn = true;
    }

    if (rtrn) {
      return {
        address: email.address,
        domain: closestDomain,
        full: email.address + '@' + closestDomain,
      };
    }
  }

  /* The email address exactly matches one of the supplied domains, does not closely
   * match any domain and does not appear to simply have a mispelled top-level domain,
   * or is an invalid email address; do not return a suggestion.
   */
  return undefined;
}

export default suggestEmail;
