import { useEffect } from "react";

export type UrlRule = (url: string) => string;

export const RULES: { [key: string]: UrlRule } = {
  ensureHttps: (url: string) => {
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    return url;
  },
  addProtocolIfEmpty: (url: string) => {
    if (url.length === 0) {
      return "https://";
    }
    return url;
  },
  doesntEndWithSlash: (url: string) => {
    if (url.endsWith("/")) {
      return url.slice(0, -1);
    }
    return url;
  },
  removeDuplicateProtocol: (url) => {
    if (/^(https?:\/\/){2,}/i.test(url)) {
      return url.replace(/^(https?:\/\/)+(?=https?:\/\/)/i, "");
    }
    return url;
  },
  ensureProtocol: (url) => {
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
  fixBrokenProtocol: (url) => {
    return (
      url
        // https.//example.com (. instead of :)
        .replace(/^https?\.\/\//i, "https://")
        .replace(/^http\.\/\//i, "http://")
        // https:/example.com or http:///example.com (not two slashes)
        .replace(/^https:\/+/, "https://")
        .replace(/^http:\/+/, "http://")
        // https//example.com/ (no colon)
        .replace(/^https\/\//, "https://")
        .replace(/^http\/\//, "http://")
        // htps://example.com/ or htttp://example.com/ (wrong number of t)
        .replace(/^ht+ps:\/\//, "https://")
        .replace(/^ht+p:\/\//, "http://")
        // htts://example.com/ (no p)
        .replace("htts://", "https://")
        .replace("htt://", "http://")
    );
  },
};

export function ruleset(...rules: (UrlRule | UrlRule[])[]): UrlRule[] {
  return rules.flat();
}

export const DEFAULT_RULES = ruleset(
  RULES.fixBrokenProtocol,
  RULES.removeDuplicateProtocol,
  RULES.ensureProtocol
);

export function improveUrlInput(
  url: string,
  rules: UrlRule[] = DEFAULT_RULES
): string | null {
  let newUrl = url;
  for (const rule of rules) {
    newUrl = rule(newUrl);
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
