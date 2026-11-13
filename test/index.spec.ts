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
});
