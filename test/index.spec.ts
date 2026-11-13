import MailSpellChecker, { POPULAR_SLDS, POPULAR_TLDS } from '../src';
import run from '../src/lib/run';
import distanceFunction from '../src/lib/fuzzy-detection/sift3-distance';
import encodeEmail from '../src/lib/helpers/encode-email';
import findClosestDomain from '../src/lib/helpers/find-closest-domain';
import parseEmail from '../src/lib/helpers/parse-email';

const domains = [
  'google.com',
  'gmail.com',
  'emaildomain.com',
  'comcast.net',
  'facebook.com',
  'msn.com',
  'zoho.com',
];
const secondLevelDomains = [
  'yahoo',
  'hotmail',
  'mail',
  'live',
  'outlook',
  'gmx',
];
const topLevelDomains = ['co.uk', 'com', 'org', 'info', 'fr'];

const findClosest = (domain: string, domains: string[]) => {
  return findClosestDomain({
    domain,
    domains,
    distanceFunction,
    threshold: 2,
  });
};

describe('mailSpellChecker', () => {
  describe('run', function () {
    let suggestedSpy: any, emptySpy: any;

    beforeEach(function () {
      suggestedSpy = jest.fn();
      emptySpy = jest.fn();
    });

    it("calls the 'suggested' callback with the element and result when there's a suggestion", function () {
      run({
        email: 'test@gmail.co',
        suggested: suggestedSpy,
        empty: emptySpy,
      });

      expect(suggestedSpy).toHaveBeenCalledWith({
        address: 'test',
        domain: 'gmail.com',
        full: 'test@gmail.com',
      });

      expect(emptySpy).not.toHaveBeenCalled();
    });

    it("calls the 'empty' callback with the element when there's no suggestion", function () {
      run({
        email: 'contact@kicksend.com',
        suggested: suggestedSpy,
        empty: emptySpy,
      });

      expect(suggestedSpy).not.toHaveBeenCalled();
      expect(emptySpy).toHaveBeenCalled();
    });

    it("calls the 'empty' callback with the element when email is empty", function () {
      run({
        email: '',
        suggested: suggestedSpy,
        empty: emptySpy,
      });

      expect(suggestedSpy).not.toHaveBeenCalled();
      expect(emptySpy).toHaveBeenCalled();
    });

    it("returns the result when 'suggested' callback is not defined", function () {
      const result = run({
        email: 'test@gmail.co',
      });

      expect(result).toEqual({
        address: 'test',
        domain: 'gmail.com',
        full: 'test@gmail.com',
      });
    });

    it('takes in an array of specified domains', function () {
      run({
        email: 'test@emaildomain.con',
        suggested: suggestedSpy,
        empty: emptySpy,
        domains: domains,
      });

      expect(suggestedSpy).toHaveBeenCalledWith({
        address: 'test',
        domain: 'emaildomain.com',
        full: 'test@emaildomain.com',
      });
    });

    it('validates common emails', function () {
      expect(
        run({
          email: 'test@gmal.com',
          domains: domains,
        })
      ).toEqual({
        address: 'test',
        domain: 'gmail.com',
        full: 'test@gmail.com',
      });

      expect(
        run({
          email: 'test@yaho.com',
          domains: domains,
        })
      ).toEqual({
        address: 'test',
        domain: 'yahoo.com',
        full: 'test@yahoo.com',
      });

      expect(
        run({
          email: 'test@zopo.com',
          domains: domains,
        })
      ).toEqual({
        address: 'test',
        domain: 'zoho.com',
        full: 'test@zoho.com',
      });
    });

    it('validates emails with empty spaces', function () {
      expect(
        run({
          email: '         test@gmal.com',
          domains: domains,
        })
      ).toEqual({
        address: 'test',
        domain: 'gmail.com',
        full: 'test@gmail.com',
      });
    });
  });

  describe('parseEmail', function () {
    it('returns a hash of the address, the domain, and the top-level domain', function () {
      expect(parseEmail('test@example.com')).toEqual({
        address: 'test',
        domain: 'example.com',
        topLevelDomain: 'com',
        secondLevelDomain: 'example',
      });

      expect(parseEmail('test@example.co.uk')).toEqual({
        address: 'test',
        domain: 'example.co.uk',
        topLevelDomain: 'co.uk',
        secondLevelDomain: 'example',
      });

      /* This test is for illustrative purposes as the parseEmail function should return a better
       * representation of the true top-level domain in the case of an email address with subdomains.
       */
      expect(parseEmail('test@mail.randomsmallcompany.co.uk')).toEqual({
        address: 'test',
        domain: 'mail.randomsmallcompany.co.uk',
        topLevelDomain: 'randomsmallcompany.co.uk',
        secondLevelDomain: 'mail',
      });
    });

    it('splits RFC compliant emails', function () {
      expect(parseEmail('"foo@bar"@example.com')).toEqual({
        address: '"foo@bar"',
        domain: 'example.com',
        topLevelDomain: 'com',
        secondLevelDomain: 'example',
      });
      expect(parseEmail('containsnumbers1234567890@example.com')).toEqual({
        address: 'containsnumbers1234567890',
        domain: 'example.com',
        topLevelDomain: 'com',
        secondLevelDomain: 'example',
      });
      expect(parseEmail('contains+symbol@example.com')).toEqual({
        address: 'contains+symbol',
        domain: 'example.com',
        topLevelDomain: 'com',
        secondLevelDomain: 'example',
      });
      expect(parseEmail('contains-symbol@example.com')).toEqual({
        address: 'contains-symbol',
        domain: 'example.com',
        topLevelDomain: 'com',
        secondLevelDomain: 'example',
      });
      expect(parseEmail('contains.symbol@domain.contains.symbol')).toEqual({
        address: 'contains.symbol',
        domain: 'domain.contains.symbol',
        topLevelDomain: 'contains.symbol',
        secondLevelDomain: 'domain',
      });
      expect(parseEmail('"contains.and symbols"@example.com')).toEqual({
        address: '"contains.and symbols"',
        domain: 'example.com',
        topLevelDomain: 'com',
        secondLevelDomain: 'example',
      });
      expect(parseEmail('"contains.and.@.symbols.com"@example.com')).toEqual({
        address: '"contains.and.@.symbols.com"',
        domain: 'example.com',
        topLevelDomain: 'com',
        secondLevelDomain: 'example',
      });
      expect(
        parseEmail(
          '"()<>[]:;@,\\"!#$%&\'*+-/=?^_`{}|     ~       ?            ^_`{}|~.a"@allthesymbols.com'
        )
      ).toEqual({
        address:
          '"()<>[]:;@,\\"!#$%&\'*+-/=?^_`{}|     ~       ?            ^_`{}|~.a"',
        domain: 'allthesymbols.com',
        topLevelDomain: 'com',
        secondLevelDomain: 'allthesymbols',
      });
      expect(parseEmail('postbox@com')).toEqual({
        address: 'postbox',
        domain: 'com',
        topLevelDomain: 'com',
        secondLevelDomain: '',
      });
    });

    it('returns false for email addresses that are not RFC compliant', function () {
      expect(parseEmail('example.com')).toBeFalsy();
      expect(parseEmail('abc.example.com')).toBeFalsy();
      expect(parseEmail('@example.com')).toBeFalsy();
      expect(parseEmail('test@')).toBeFalsy();
    });

    it('trims spaces from the start and end of the string', function () {
      expect(parseEmail(' postbox@com')).toEqual({
        address: 'postbox',
        domain: 'com',
        topLevelDomain: 'com',
        secondLevelDomain: '',
      });
      expect(parseEmail('postbox@com ')).toEqual({
        address: 'postbox',
        domain: 'com',
        topLevelDomain: 'com',
        secondLevelDomain: '',
      });
    });

    describe('findClosestDomain', function () {
      it('returns the most similar domain', function () {
        expect(findClosest('google.com', domains)).toEqual('google.com');
        expect(findClosest('gmail.com', domains)).toEqual('gmail.com');
        expect(findClosest('emaildoman.com', domains)).toEqual(
          'emaildomain.com'
        );
        expect(findClosest('gmsn.com', domains)).toEqual('msn.com');
        expect(findClosest('gmaik.com', domains)).toEqual('gmail.com');
      });

      it('returns the most similar second-level domain', function () {
        expect(findClosest('hotmial', secondLevelDomains)).toEqual('hotmail');
        expect(findClosest('tahoo', secondLevelDomains)).toEqual('yahoo');
        expect(findClosest('yaho', secondLevelDomains)).toEqual('yahoo');
        expect(findClosest('livr', secondLevelDomains)).toEqual('live');
        expect(findClosest('outllok', secondLevelDomains)).toEqual('outlook');
      });

      it('returns the most similar top-level domain', function () {
        expect(findClosest('cmo', topLevelDomains)).toEqual('com');
        expect(findClosest('ogr', topLevelDomains)).toEqual('org');
        expect(findClosest('ifno', topLevelDomains)).toEqual('info');
        expect(findClosest('com.uk', topLevelDomains)).toEqual('co.uk');
      });
    });
  });

  describe('encodeEmail', function () {
    it("escapes the element's value", function () {
      const result = encodeEmail('<script>alert("a")</script>@emaildomain.con');
      expect(result).not.toMatch(/<script>/);
    });

    it('allows valid special characters', function () {
      const result = encodeEmail(" g1!#$%&'*+-/=?^_`{|}@gmai.com");
      expect(result).toEqual(" g1!#$%&'*+-/=?^_`{|}@gmai.com");
    });

    it('does not encode empty spaces', function () {
      expect(encodeEmail('   postbox@com   ')).toEqual('   postbox@com   ');
    });

    it('does not encode percentage', function () {
      expect(encodeEmail('%%%postbox%@%com%')).toEqual('%%%postbox%@%com%');
    });

    it('does not encode caret', function () {
      expect(encodeEmail('^^^postbox^^^@^^^com^^^')).toEqual(
        '^^^postbox^^^@^^^com^^^'
      );
    });

    it('does not encode backtick', function () {
      expect(encodeEmail('`` hola@jorge.com')).toEqual('`` hola@jorge.com');
    });

    it('does not encode brackets', function () {
      expect(encodeEmail('{{hola@jorge.com}}')).toEqual('{{hola@jorge.com}}');
    });

    it('does not encode pipe', function () {
      expect(encodeEmail('|||hola|||@jorge.com')).toEqual(
        '|||hola|||@jorge.com'
      );
    });
  });

  describe('domains with regex special characters (#34)', () => {
    it('does not throw on unbalanced parentheses', () => {
      expect(() =>
        run({ email: 'jorge@bigidaunashtnsuaeonsti.co)' })
      ).not.toThrow();
      expect(() => run({ email: 'a@foo.(om' })).not.toThrow();
    });

    it('replaces the TLD literally instead of as a pattern', () => {
      expect(run({ email: 'a@foo.(om' })).toEqual({
        address: 'a',
        domain: 'foo.com',
        full: 'a@foo.com',
      });
      expect(run({ email: 'a@foo.c+m' })).toEqual({
        address: 'a',
        domain: 'foo.com',
        full: 'a@foo.com',
      });
    });
  });

  describe('.com preference for near-tie TLD typos (#33)', () => {
    it.each([
      ['test@test.con', 'test@test.com'],
      ['test@test.cin', 'test@test.com'],
      ['test@test.cm', 'test@test.com'],
    ])('suggests .com for %s', (email, full) => {
      expect(run({ email })?.full).toBe(full);
    });

    it.each(['test@test.co', 'test@test.ca', 'test@test.cn'])(
      'leaves valid TLD %s untouched',
      email => {
        expect(run({ email })).toBeUndefined();
      }
    );

    it('still uses the raw distance for the threshold', () => {
      // raw distance to "com" is 2.5, above the threshold of 2
      expect(findClosestDomainWithPreference('xyom', ['com'])).toBeUndefined();
      // "com" (2.5) is out of range, so the in-range "co" (2) still wins
      expect(findClosestDomainWithPreference('cxyz', ['com', 'co'])).toBe('co');
    });
  });
});

function findClosestDomainWithPreference(domain: string, domains: string[]) {
  return findClosestDomain({
    domain,
    domains,
    distanceFunction,
    threshold: 2,
    preferred: { domain: 'com', bias: 0.75 },
  });
}

describe('default "mail" handling (#32)', () => {
  it.each(['jorge@mask.io', 'a@main.com', 'a@nail.com', 'a@mall.com'])(
    'does not suggest mail.* for %s',
    email => {
      expect(run({ email })).toBeUndefined();
    }
  );

  it('does not correct real mail.com addresses', () => {
    expect(run({ email: 'a@mail.com' })).toBeUndefined();
  });

  it('still corrects the other default second-level domains', () => {
    expect(run({ email: 'a@hotmial.com' })?.full).toBe('a@hotmail.com');
    expect(run({ email: 'a@outlok.com' })?.full).toBe('a@outlook.com');
    expect(run({ email: 'a@yahooo.com' })?.full).toBe('a@yahoo.com');
  });
});

describe('public config exports (#19)', () => {
  it('exports the default second-level domains', () => {
    expect(MailSpellChecker.POPULAR_SLDS).toEqual(
      expect.arrayContaining(['yahoo', 'hotmail', 'live', 'outlook'])
    );
    expect(POPULAR_SLDS).toBe(MailSpellChecker.POPULAR_SLDS);
  });

  it('lets users extend the defaults', () => {
    expect(
      run({
        email: 'a@wala.co.il',
        secondLevelDomains: [...POPULAR_SLDS, 'walla'],
        topLevelDomains: [...POPULAR_TLDS, 'co.il'],
      })?.full
    ).toBe('a@walla.co.il');
  });

  it('throws a clear error when email is missing', () => {
    expect(() => run({} as any)).toThrow('email must be a string');
  });

  it('calls the empty callback, not the suggested one, with no suggestion', () => {
    const suggested = jest.fn();
    const empty = jest.fn();
    run({ email: 'a@gmail.com', suggested, empty });
    expect(empty).toHaveBeenCalled();
    expect(suggested).not.toHaveBeenCalled();
  });
});

describe('Israeli TLDs (#18)', () => {
  it.each([
    'example@actcom.net.il',
    'a@foo.org.il',
    'a@uni.ac.il',
    'a@x.gov.il',
    'a@foo.co.il',
  ])('does not correct %s', email => {
    expect(run({ email })).toBeUndefined();
  });

  it('still corrects typos in them', () => {
    expect(run({ email: 'a@foo.net.ill' })?.full).toBe('a@foo.net.il');
  });
});

describe('untrusted input hardening', () => {
  it('does not throw on malformed unicode (lone surrogates)', () => {
    expect(() => run({ email: 'a@gmail.co\uD800' })).not.toThrow();
    expect(run({ email: '\uDC00@gmial.com' })).toBeUndefined();
  });

  it('skips inputs far longer than any valid address', () => {
    expect(
      run({ email: 'a@' + 'x'.repeat(5_000_000) + '.com' })
    ).toBeUndefined();
    expect(run({ email: ' '.repeat(1000) + 'a@gmial.com' })).toBeUndefined();
  });

  it('still handles long but plausible addresses', () => {
    const local = 'a'.repeat(64);
    expect(run({ email: `${local}@gmial.com` })?.domain).toBe('gmail.com');
  });
});
