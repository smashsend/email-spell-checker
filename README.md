<p align="center">
  <a href="https://smashsend.com/tools/email-spell-checker?ref=email-spell-checker-github">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://smashsend.com/brand/smashsend_white_logo.png" />
      <img src="https://smashsend.com/brand/smashsend_logo.png" width="320px" />
    </picture>
  </a>
</p>
<h1 align="center">The best way to check a misspelled email address in JavaScript</h1>

<br/>

<p align="center">
  🔐 Reduce failed authentication &nbsp;&nbsp;&nbsp;&nbsp; ⬆️ Increase email delivery &nbsp;&nbsp;&nbsp;&nbsp; ⚡️ Built for speed
</p>

<br/>

<p align="center">
  <img src="https://smashsend.com/open-source/email-spell-checker/demo.gif" alt="Typing a misspelled address and the checker suggesting the correct domain">
</p>

<br/>

## @zootools/email-spell-checker

[![npm package][npm-img]][npm-url]
[![npm package][bundlephobia-img]][bundlephobia-url]
[![Issues][issues-img]][issues-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]

<b>EmailSpellChecker</b> is a lightweight JavaScript module written in TypeScript that suggests the right domain when your users misspell it in an email address.

At [SmashSend, an email marketing and referral tool](https://smashsend.com?ref=email-spell-checker-github), we validate thousands of misspelled emails daily with _EmailSpellChecker_ and it helped us to reduce bounced emails by 30%.

It's by far the <strong>easiest way to reduce misspelled email addresses</strong> in your web apps and server.

## The features you deserve

We rewrote and improved [mailcheck.js](https://github.com/mailcheck/mailcheck), a great module that is no longer maintained (7+ years since the last update) and we fixed critical bugs like [this](https://github.com/ZooTools/email-spell-checker/pull/3), or [this](https://github.com/ZooTools/email-spell-checker/pull/4).

- ⚡️ <b>Lightning fast</b>: Highly performant email checking using `Sift3` - a fast and accurate string distance algorithm.
- 🔋 <b>Updated</b>: 39+ popular domains, and 66+ modern TLDs out-of-the-box. Frequently updated.
- 🚀 <b>Ridiculously small</b>: 1.8KB (minzip) and 0 external dependencies. We agree, big bundles suck!
- 💙 <b>TypeScript</b>: Fully written in TypeScript, cause we know you love it and we too.
- ⚙️ <b>Extensible</b>: Allows you to pass your custom rules and domains. Tweak it as you need.
- 🔨 <b> 1-minute migration</b>: Same API and functions as mailcheck so you can switch in a sec!
- 🔐 <b>Unit tested</b>: Cause we'd never use a library without tests :).

## Why should you validate email spelling?

Typos in the email will harm your business. Especially email deliverability. Common user misspellings such as “gnail” instead of “gmail” or “yaho” instead of “yahoo” can be used as [spam traps](https://sendgrid.com/blog/spam-traps-what-they-are-and-why-you-should-pay-attention-to-them/) by ISPs, and as a result, your emails will be blocked or marked as spam.

Common use cases:

- User authentication (login, signup, email recovery).
- Backend email validation.
- Newsletter subscriptions.

## Tutorials

Here are some highly-requested tutorials.

- [🟨 JavaScript: Getting started in 5 minutes](./demos/javascript/)
- 🟦 React: Validating email spell in React (coming soon)
- [🟩 Node with Express.js: Validating email spell in Node](./demos/node-express/)

If you want to write a tutorial [send a PR](https://github.com/smashsend/email-spell-checker/pulls) or [create an issue](https://github.com/smashsend/email-spell-checker/issues) if you want to ask for one.

## Getting Started in 5 minutes

Adding <b>EmailSpellChecker</b> to your project takes less than 5 minutes.

It works on any JavaScript framework (Vue, React, Next.JS, Angular, Svelte, etc) as well as your backend server.

### Installation

_Install with npm:_

```bash
npm i @zootools/email-spell-checker --save
```

_Install with yarn:_

```bash
yarn add @zootools/email-spell-checker
```

_Use from a CDN (no build step):_

```html
<script type="module">
  import emailSpellChecker from 'https://cdn.jsdelivr.net/npm/@zootools/email-spell-checker/+esm';

  console.log(emailSpellChecker.run({ email: 'jorge@gmaik.co' })?.full); // jorge@gmail.com
</script>
```

To pin a version, use `https://cdn.jsdelivr.net/npm/@zootools/email-spell-checker@1/+esm`. See [`demos/html`](./demos/html) for a full example.

### Basic Example

Using the library is easy. Import it, call the `run` function with the email you want to validate, and get a suggestion.

```js
import emailSpellChecker from '@zootools/email-spell-checker';

const suggestion = emailSpellChecker.run({
  email: 'jorge@gmaik.co'
})

if (suggestion) {
  // dev: user made a typo -- handle the suggestion.
  // for example: show a message to fix the email.

  console.log(suggestion.address); // jorge
  console.log(suggestion.domain); // gmail.com
  console.log(suggestion.full); // jorge@gmail.com
}
```

> **Spell checker, not a validator.** `run` returns a suggestion when the domain looks like a typo, and `undefined` otherwise. `undefined` means "nothing to suggest". It does **not** mean the email is valid: `run({ email: 'test' })` and `run({ email: 'valid@gmail.com' })` both return `undefined`. If you also need syntax or deliverability checks, use a dedicated validation library alongside this one.

## Extending Domains

<b>EmailSpellChecker</b> has inbuilt defaults if the `domains`, `secondLevelDomains` or `topLevelDomains` options aren't provided.

The out-of-the-box configuration is the best for 99% of cases. If you are that 1%, here is how you can extend the configuration :).

#### How the defaults work

Suggestions are checked in this order:

1. **`domains`** (`POPULAR_DOMAINS`): full domains such as `gmail.com`. If the whole domain is close to one of these, it is suggested. For example, `gmial.com` → `gmail.com`.
2. **`secondLevelDomains`** (`POPULAR_SLDS`): provider names without a TLD (`yahoo`, `hotmail`, `live`, `outlook`). They match **any** TLD, which is why big providers with many country domains live here and not in `domains`. For example, `hotmial.co.uk` → `hotmail.co.uk` and `outlok.com` → `outlook.com`.
3. **`topLevelDomains`** (`POPULAR_TLDS`): TLDs such as `com` and `co.uk`, used to fix the ending. For example, `example.con` → `example.com`.

If the address already uses a known second-level domain together with a known TLD (e.g. `yahoo.fr`), nothing is suggested.

#### Adding your own Domains

You can replace EmailSpellChecker's default domain/TLD suggestions by supplying replacements to `EmailSpellChecker.run`:

```js
emailSpellChecker.run({
  email: 'jorge@gmaik.co',
  domains: [...emailSpellChecker.POPULAR_DOMAINS, 'customdomain.com'], // extends the default domains
  secondLevelDomains: [...emailSpellChecker.POPULAR_SLDS, 'walla'], // extends the default SLDs
  topLevelDomains: ['com.au', 'ru'], // replaces the default TLDs
});
```

## Tests

EmailSpellChecker is tested with [Jest](https://jestjs.io/), a popular JavaScript testing framework from Facebook with a focus on simplicity.

Run `npm test` from the command line to run the test suite.

## Who uses EmailSpellChecker?

We're putting together a list of happy users of EmailSpellChecker.

Tweet us [@ZooToolsHQ](https://twitter.com/ZooToolsHQ) and [@JGFerreiro](https://twitter.com/JGFerreiro) if you are interested to appear.

## Customer support & updates

Updates

- 🎯 [Join our mailing lists to get useful information](https://form.waitlistpanda.com/go/8H98mVOzZhwGMalf8nfb) about this and other useful open source libraries: https://form.waitlistpanda.com/go/8H98mVOzZhwGMalf8nfb
- 📆 Click "Watch repo" on GitHub and ⭐️ the repo to be notified of useful information.

Customer support

- 🤝 Do you have bugs or issues? Email [help@smashsend.com](mailto:help@smashsend.com) or [create an issue](https://github.com/smashsend/email-spell-checker/issues)

Socials

- [@ZooToolsHQ](https://twitter.com/ZooToolsHQ)
- [@JGFerreiro](https://twitter.com/JGFerreiro)

## Maintainers

This library is used and maintained by <a href="https://smashsend.com?ref=github-spell">SmashSend: Growth and marketing tools</a> for ambitious teams.

We use this library heavily in <a href="https://smashsend.com/compare/mailchimp-alternative?ref=github-spell">SmashSend, a MailChimp alternative for sending viral marketing campaigns</a>.

You can try the checker live on <a href="https://smashsend.com/tools/email-spell-checker?ref=github-spell">the tool page</a>.

## We're hiring!

Badass developer looking for a job? [Join the grind](https://www.notion.so/zootools/Careers-at-ZooTools-2e2815794b14415daca297506c54cb69)!

<p>
  <!-- The original "made with love" badge lived on open-source.zootools.co,
       a Bunny CDN whose storage zone was emptied during the ZooTools
       decommission. No copy survives in any repo and the Wayback Machine has
       no snapshot, so it is text now — which also cannot 404. -->
  Made with love by <a href="https://smashsend.com?ref=email-spell-checker-github">SmashSend</a>
</p>

[downloads-img]: https://img.shields.io/npm/dt/@zootools/email-spell-checker?labelColor=475873&color=6ead0a
[downloads-url]: https://www.npmtrends.com/@zootools/email-spell-checker
[npm-img]: https://img.shields.io/npm/v/@zootools/email-spell-checker?labelColor=475873&color=6ead0a
[npm-url]: https://www.npmjs.com/package/@zootools/email-spell-checker
[bundlephobia-img]: https://badgen.net/bundlephobia/minzip/@zootools/email-spell-checker?labelColor=475873&color=6ead0a
[bundlephobia-url]: https://bundlephobia.com/package/@zootools/email-spell-checker
[issues-img]: https://img.shields.io/github/issues/smashsend/email-spell-checker?labelColor=475873&color=6ead0a
[issues-url]: https://github.com/smashsend/email-spell-checker/issues
[codecov-img]: https://codecov.io/gh/zootools/@zootools/email-spell-checker/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/zootools/@zootools/email-spell-checker
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
