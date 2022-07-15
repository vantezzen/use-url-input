import { useEffect } from "react";

export type UrlRule = {
  name: string;
  run: (url: string) => string;
};

export const DEFAULT_RULES: UrlRule[] = [
  // {
  //   name: "Add protocol if empty",
  //   run: (url: string) => {
  //     if (url.length === 0) {
  //       return "https://";
  //     }
  //     return url;
  //   },
  // },
  {
    name: "Remove duplicate protocol",
    run: (url) => {
      if (/^(https?:\/\/){2,}/i.test(url)) {
        return url.replace(/^(https?:\/\/)+(?=https?:\/\/)/i, "");
      }
      return url;
    },
  },
  {
    name: "Ensure protocol",
    run: (url) => {
      if (url.length > 0) {
        let beginsWithPossiblePrefix = false;
        const possiblePrefixes = ["https://", "http://"];
        for (const prefix of possiblePrefixes) {
          if (url.startsWith(prefix.substring(0, url.length))) {
            beginsWithPossiblePrefix = true;
            break;
          }
        }
        if (!beginsWithPossiblePrefix) {
          url = possiblePrefixes[0] + url;
        }
      }
      return url;
    },
  },
];

export function improveUrlInput(
  url: string,
  rules: UrlRule[] = DEFAULT_RULES
): string | null {
  let newUrl = url;
  for (const rule of rules) {
    newUrl = rule.run(newUrl);
  }
  if (newUrl === url) {
    return null;
  }
  return newUrl;
}

/**
 * Effect to improve URL input to be a standard "https://example.com" format.
 *
 * Eg.
 * "example.com" -> "https://example.com"
 * "example.com/" -> "https://example.com/"
 * "example.com/path" -> "https://example.com/path"
 * "https://https://example.com" -> "https://example.com"
 *
 * @param url URL to improve
 * @param setUrl Function to set the URL
 * @returns
 */
export default function useUrlInput(
  url: string,
  setUrl: (url: string) => void,
  rules: UrlRule[] = DEFAULT_RULES
) {
  useEffect(() => {
    let newUrl = improveUrlInput(url, rules);
    if (newUrl !== null) {
      setUrl(newUrl);
    }
  }, [url]);
}
