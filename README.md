# use-url-input

> Hook to create user-friendly input for HTTP(s) URLs

[![NPM](https://img.shields.io/npm/v/use-url-input.svg)](https://www.npmjs.com/package/use-url-input) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

When trying to create a URL input that requires URLs in the format of "https://example.com/path", it is often difficult to ensure that users enter the URL correctly.
To help prevent these issues, this package provides a `useUrlInput` hook that can be used to create a URL input that improves the URL format while the user types.

Often errors are:

- User enters `example.com` instead of `https://example.com`, not entering the protocol
  Solution: Package adds `https://` to the beginning of the URL if the user doesn't enter the protocol

- Default input value is `https://` to help the user enter the URL, but user pastes their URL from somewhere, resulting in `https://https://example.com`
  Solution: Packages removes duplicate `https://` and `http://` from the beginning of the URL

- User mistypes `https://` or `http://` as `htps://` or `https.//` or `htttp://` etc.
  Solution: Package fixes common misspellings of the protocol

The hook is designed to be unopinionated so it can be used with many form libraries and doesn't provide state on its own.

> The corrected value of the hook isn't guaranteed to be a valid, full URL. Instead it provides help to the user while they type with small corrections - you should still validate the final URL yourself when the user submits or leaves the form.

## Demo

Visit https://vantezzen.github.io/use-url-input/ for a demo of this library. The example can be found under `example/src/App.js`.

## Install

```bash
npm install use-url-input
```

## Usage

### `useUrlInput(url: string, setUrl: (url: string) => void, rules: UrlRule[] = DEFAULT_RULES): void`

Simply add the hook into your component and pass in the URL and a function to set the URL. The hook will attach itself to value updates using a `useEffect` hook and will call `setUrl` if it finds an improvement.

Example:

```tsx
import * as React from "react";

import useUrlInput from "use-url-input";

const Example = () => {
  const [url, setUrl] = useState("");
  useUrlInput(url, setUrl);

  return (
    <input
      type="text"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="https://example.com"
    />
  );
};
```

### `improveUrl(url: string, rules: UrlRule[] = DEFAULT_RULES): string | null`

Alternatively, you can use the `improveUrl` function to improve a URL directly instead of using a hook. The function will return the improved URL or `null` if no improvements are found.

### Custom ruleset

The library uses a set of reuable rules to improve the URL. Not all rules are enabled by default and you might need to disable a default rule, so you can use your own rules by passing in an array of rules as the `rules` argument.

Additionally, the `ruleset` helper function can be used to create a ruleset from a list of rules and rule arrays.

```tsx
import * as React from "react";

import useUrlInput, { RULES, DEFAULT_RULES, ruleset } from "use-url-input";

// Use the default ruleset and add a custom rule "doesntEndWithSlash"
const myRules = ruleset(DEFAULT_RULES, RULES.doesntEndWithSlash);

const Example = () => {
  const [url, setUrl] = useState("");
  useUrlInput(url, setUrl, myRules);

  return (
    <input
      type="text"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="https://example.com"
    />
  );
};
```

Available rules are:

- `RULES.fixBrokenProtocol` (part of the default ruleset): Fixes common issues of the URL protocol (e.g. `htps://`, `https.//`, `https:///`)
- `RULES.ensureProtocol` (part of the default ruleset): Ensures the URL starts with `https://` or `http://`. If the user starts typing a URL without it, this will add it.
- `RULES.removeDuplicateProtocol` (part of the default ruleset): Removes duplicate `https://` and `http://` from the beginning of the URL.
- `RULES.doesntEndWithSlash`: Removes the trailing slash from the URL.
- `RULES.addProtocolIfEmpty`: If the input is completely empty, it will add `https://`.
- `RULES.ensureHttps`: Replaces `http://` with `https://`. Please keep in mind that some websites may not support HTTPS, resulting in invalid URLs - because of this, the rule is not in the default ruleset.

Please keep in mind that the rules will be executed in the order they are passed in so using a different order may result in multiple render passes.

### Custom rules

The library uses a set of reuable rules to improve the URL. You can use your own rules by passing in an array of rules as the `rules` argument.

For example, you can add a rule to ensure that the URL ends with ".com" using

```tsx
import * as React from "react";

import useUrlInput, { DEFAULT_RULES, ruleset } from "use-url-input";

const ensureEndsWithDotCom = (url: string) => {
  if (!url.endsWith(".com")) {
    return url + ".com";
  }
  return url;
};

const Example = () => {
  const [url, setUrl] = useState("");
  useUrlInput(url, setUrl, ruleset(DEFAULT_RULES, ensureEndsWithDotCom));

  return (
    <input
      type="text"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="https://example.com"
    />
  );
};
```

## Development

To get started, in one tab, run:
$ npm start

And in another tab, run the create-react-app dev server:
$ cd example && npm start

## License

MIT © [vantezzen](https://github.com/vantezzen)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
