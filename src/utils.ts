// Error handling utils

import type { Result } from "./types";

export function Ok<T>(value: T): Result<T, never> {
  return { ok: value };
}

export function Err<E>(error: E): Result<never, E> {
  return { err: error };
}

export function isErr<T, E>(result: Result<T, E>): result is { err: E } {
	return "err" in result;
}