import useUrlInput, { improveUrlInput, ruleset } from "./";
import { renderHook } from "@testing-library/react-hooks";

const callInputWith = (value: string) => {
  const updateFn = jest.fn();
  renderHook(() => useUrlInput(value, updateFn));
  return updateFn;
};

describe("useUrlInput", () => {
  it("doesn't change valid URLs", () => {
    const updateFn = callInputWith("https://www.example.com");

    expect(updateFn).not.toHaveBeenCalled();
  });

  it("removes duplicate protocols", () => {
    const updateFn = callInputWith("https://http://https://http://example.com");

    expect(updateFn).toHaveBeenCalledWith("http://example.com");
  });

  it("adds protocol if needed", () => {
    const updateFn = callInputWith("example");

    expect(updateFn).toHaveBeenCalledWith("https://example");
  });

  it("doesn't add protocol if could be typing protocol", () => {
    const updateFn = callInputWith("htt");

    expect(updateFn).not.toHaveBeenCalled();
  });
  it("executes custom rules", () => {
    const rules = ruleset(() => "ok");
    const result = improveUrlInput("a", rules);

    expect(result).toBe("ok");
  });
  it("fixes common errors in the protocol", () => {
    expect(improveUrlInput("htt://example.com")).toBe("http://example.com");
    expect(improveUrlInput("https.//example.com")).toBe("https://example.com");
    expect(improveUrlInput("https.////example.com")).toBe(
      "https://example.com"
    );
    expect(improveUrlInput("https:///example.com")).toBe("https://example.com");
  });
});
