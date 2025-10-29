// Error handling utils

/**
 * A result type inspired by Rust's `Result` type.
 *
 * Can either be in an error or ok state.
 *
 * Used to treat errors as values, to simplify the process of dealing with API responses.
 */
export type Result<T, E> =
  | {
      ok: T;
      err?: never;
    }
  | {
      ok?: never;
      err: E;
    };

/**
 * Creates a success result.
 *
 * @param value - The value to wrap in the result.
 * @returns A success result.
 */
export function Ok<T>(value: T): Result<T, never> {
  return { ok: value };
}

/**
 * Creates an error result.
 *
 * @param error - The error to wrap in the result.
 * @returns An error result.
 */
export function Err<E>(error: E): Result<never, E> {
  return { err: error };
}

/**
 * Checks if a result is an error.
 *
 * Also tells TypeScript that the result is an error, so that it can be used in type guards.
 *
 * @param result - The result to check.
 * @returns True if the result is an error, false if the result is ok.
 */
export function isErr<T, E>(result: Result<T, E>): result is { err: E } {
  return "err" in result;
}

// HTML parsing (requires access to the DOM)

/**
 * Decodes HTML entities in a string to plain text characters.
 *
 * @param html - The HTML string to decode. (Contains HTML entities like `&amp;`, `&quot;`, `&#039;`, etc.)
 * @returns The decoded string, with plain text characters.
 */
export function decodeHtml(html: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  return textarea.value;
}

// Strings

/**
 * Capitalizes the first letter of a string.
 *
 * @example
 * capitalize("hello") // "Hello"
 * capitalize("Hello") // "Hello"
 * capitalize("123 hello") // "123 hello"
 * capitalize("") // ""
 *
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
