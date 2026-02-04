declare module "bun:test" {
  export function describe(
    name: string,
    fn: () => void | Promise<void>
  ): void;

  export function it(
    name: string,
    fn: () => void | Promise<void>
  ): void;

  export function expect<T = unknown>(
    actual: T,
    message?: string
  ): {
    toBe(expected: T): void;
    toEqual(expected: T): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    // add more matchers here as needed
  };
}

