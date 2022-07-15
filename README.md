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

The hook is designed to be unopinionated so it can be used with many form libraries and doesn't provide state on its own.

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

### Custom rules

The library uses a set of reuable rules to improve the URL. You can use your own rules by passing in an array of rules as the `rules` argument.

For example, you can add a rule to ensure that the URL doesn't end with a slash using

```tsx
import * as React from "react";

import useUrlInput, { DEFAULT_RULES } from "use-url-input";

const doesntEndWithSlash = (url: string) => {
  if (url.endsWith("/")) {
    return url.slice(0, -1);
  }
  return url;
};

const Example = () => {
  const [url, setUrl] = useState("");
  useUrlInput(url, setUrl, [...DEFAULT_RULES, doesntEndWithSlash]);

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
