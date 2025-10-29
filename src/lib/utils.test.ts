import {
  capitalize,
  decodeHtml,
  Err,
  isErr,
  Ok,
  updateUrlSearchParams,
} from "./utils";
import { describe, test, expect } from "vitest";

describe("error handling utils", () => {
  test("Err should create an error result", () => {
    const result = Err("test");
    expect(result.err).toBe("test");
  });

  test("Ok should create a success result", () => {
    const result = Ok("test");
    expect(result.ok).toBe("test");
  });

  test("isErr should return true if the result is an error", () => {
    const result = Err("test");
    expect(isErr(result)).toBe(true);
  });

  test("isErr should return false if the result is a success", () => {
    const result = Ok("test");
    expect(isErr(result)).toBe(false);
  });
});

describe("html parsing utils", () => {
  test("can decode HTML ampersands", () => {
    const html = "Hello &amp; World";
    const decoded = decodeHtml(html);
    expect(decoded).toBe("Hello & World");
  });

  test("can decode HTML quotes", () => {
    const html = "Hello &quot;World&quot;";
    const decoded = decodeHtml(html);
    expect(decoded).toBe('Hello "World"');
  });

  test("can decode HTML apostrophes", () => {
    const html = "Hello &#039;World&#039;";
    const decoded = decodeHtml(html);
    expect(decoded).toBe("Hello 'World'");
  });

  test("can decode HTML colons", () => {
    const html = "Hello &#58;World&#58;";
    const decoded = decodeHtml(html);
    expect(decoded).toBe("Hello :World:");
  });

  test("can decode HTML semicolons", () => {
    const html = "Hello &#59;World&#59;";
    const decoded = decodeHtml(html);
    expect(decoded).toBe("Hello ;World;");
  });
});

describe("string utils", () => {
  describe("capitalize", () => {
    test("should capitalize the first letter of a string", () => {
      const str = "hello";
      const capitalized = capitalize(str);
      expect(capitalized).toBe("Hello");
    });

    test("should return the same string if it is already capitalized", () => {
      const str = "Hello";
      const capitalized = capitalize(str);
      expect(capitalized).toBe("Hello");
    });

    test("can accept a non-alphabetic first letter", () => {
      const str = "123 hello";
      const capitalized = capitalize(str);
      expect(capitalized).toBe("123 hello");
    });

    test("can accept empty strings", () => {
      const str = "";
      const capitalized = capitalize(str);
      expect(capitalized).toBe("");
    });
  });
});

describe("browser utils", () => {
  describe("updateUrlSearchParams", () => {
    test("should be able to add a new search param", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("test", "test");
      updateUrlSearchParams(searchParams);
      expect(window.location.search).toBe("?test=test");
    });

    test("should not modify the rest of the URL", () => {
      const searchParams = new URLSearchParams();
      const originalProtocol = window.location.protocol;
      const originalHost = window.location.host;
      const originalPathname = window.location.pathname;
      searchParams.set("test", "test");
      updateUrlSearchParams(searchParams);
      expect(window.location.protocol).toBe(originalProtocol);
      expect(window.location.host).toBe(originalHost);
      expect(window.location.pathname).toBe(originalPathname);
    });

    test("can handle multiple search params", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("test", "test");
      updateUrlSearchParams(searchParams);
      searchParams.set("hello", "world");
      updateUrlSearchParams(searchParams);
      expect(window.location.search).toBe("?test=test&hello=world");
    });

    test("should be able to update an existing search param", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("test", "test");
      updateUrlSearchParams(searchParams);
      searchParams.set("test", "updated");
      updateUrlSearchParams(searchParams);
      expect(window.location.search).toBe("?test=updated");
    });

    test("should be able to remove an existing search param", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("test", "test");
      updateUrlSearchParams(searchParams);
      searchParams.delete("test");
      updateUrlSearchParams(searchParams);
      expect(window.location.search).toBe("");
    });
  });
});
