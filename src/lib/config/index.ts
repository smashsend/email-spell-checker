// Default configuration options

import sift3Distance from '../fuzzy-detection/sift3-distance';

/***
 * Default list of popular emails for 2022 and onwards.
 * https://www.mailmunch.com/blog/best-email-service-providers
 *
 * If you find a domain you want to add, please submit a PR.
 * Also, notice that this list is not exhaustive.
 * You can always pass your own list of domains.
 */
const POPULAR_DOMAINS = [
  'msn.com',
  'bellsouth.net',
  'telus.net',
  'comcast.net',
  'optusnet.com.au',
  'earthlink.net',
  'qq.com',
  'sky.com',
  'icloud.com',
  'sympatico.ca',
  'googlemail.com',
  'att.net',
  'xtra.co.nz',
  'web.de',
  'cox.net',
  'gmail.com',
  'ymail.com',
  'aim.com',
  'rogers.com',
  'verizon.net',
  'rocketmail.com',
  'optonline.net',
  'sbcglobal.net',
  // aol
  'aol.com',
  'aim.com',
  'me.com',
  'mac.com',
  'btinternet.com',
  'charter.net',
  'shaw.ca',
  'hey.com',
  // Proton
  'proton.me',
  'pm.me',
  'protonmail.com',
  'zoho.com',
  'yandex.com',
  'titan.email',
];

const POPULAR_TLDS = [
  'com',
  'com.au',
  'com.tw',
  'co',
  'ca',
  'co.nz',
  'co.uk',
  'de',
  'fr',
  'it',
  'ru',
  'org',
  'edu',
  'gov',
  'jp',
  'nl',
  'kr',
  'se',
  'eu',
  'ie',
  'co.il',
  'il',
  'net.il',
  'org.il',
  'ac.il',
  'gov.il',
  'us',
  'at',
  'be',
  'dk',
  'hk',
  'es',
  'gr',
  'ch',
  'no',
  'cz',
  'net',
  'net.au',
  'info',
  'biz',
  'mil',
  'co.jp',
  'sg',
  'hu',
  'uk',
  'sk',
  // Country specific popular domains
  'ar',
  'cf',
  'cl',
  'cn',
  'ga',
  'gq',
  'ir',
  'ml',
  'mx',
  'nu',
  'nz',
  'ph',
  'pl',
  'ro',
  'tk',
  'tw',
  'ua',
  'vg',
  'ws',
  'xn',
  'za',
  // popular TLDs that startup use in 2022
  // https://thewebsiteflip.com/domains/funded-startup-brands-2021/#:~:text=from%20the%20data.-,1.,TLDs%20for%20the%20foreseeable%20future.
  // https://martijnoud.com/most-popular-tld-crypto/
  'app',
  'au',
  'ai',
  'biz',
  'br',
  'blog',
  'cloud',
  'club',
  'cc',
  'de',
  'dev',
  'digital',
  'fi',
  'finance',
  'id',
  'in',
  'io',
  'me',
  'mobi',
  'network',
  'pw',
  'so',
  'xyz',
  'software',
  'to',
  'tech',
  'tv',
  'website',
];

/***
 * Real but uncommon providers. Addresses on these domains are never corrected,
 * but they are not offered as suggestions either, because their short names
 * are too close to many unrelated domains (e.g. mask.io -> mail.io).
 */
const KNOWN_UNSUGGESTED_DOMAINS = ['mail.com'];

/***
 * Default second-level domains (the part before the TLD). They match any TLD,
 * so e.g. "hotmial.co.uk" is corrected to "hotmail.co.uk".
 */
const POPULAR_SLDS = ['yahoo', 'hotmail', 'live', 'outlook'];

const DEFAULT_CONFIG = {
  domainThreshold: 2,
  domains: POPULAR_DOMAINS,

  secondLevelThreshold: 2,
  secondLevelDomains: POPULAR_SLDS,

  topLevelThreshold: 2,
  topLevelDomains: POPULAR_TLDS,

  distanceFunction: sift3Distance,
};

export {
  DEFAULT_CONFIG,
  KNOWN_UNSUGGESTED_DOMAINS,
  POPULAR_DOMAINS,
  POPULAR_SLDS,
  POPULAR_TLDS,
};
