type ExtractPathParams<T extends string> =
  T extends `${string}:${infer TParam}/${infer TRest}`
    ? TParam | ExtractPathParams<TRest>
    : T extends `${string}:${infer TParam}`
      ? TParam
      : never;

/**
 * Replaces path parameters in a URL template with their corresponding values.
 * The function ensures type safety by extracting parameter names from the URL template
 * and requiring all parameters to be provided.
 *
 * @template T - The URL template string type
 * @template P - The parameters object type, derived from URL template parameters
 * @param {T} url - The URL template with parameters in the format `:paramName`
 * @param {P} params - Object containing values for all parameters in the URL
 * @returns {string} The URL with all parameters replaced with their values
 *
 * @example
 * // Simple URL with one parameter
 * interpolateUrl('/users/:id', { id: '123' }) // => '/users/123'
 *
 * @example
 * // URL with multiple parameters
 * interpolateUrl('/org/:orgId/users/:userId', { orgId: '456', userId: '789' }) // => '/org/456/users/789'
 *
 * @example
 * // Type safety examples:
 * interpolateUrl('/users/:id', {}) // => /users/undefined
 * interpolateUrl('/users/:id', { userId: '123' }) => /users/undefined
 * interpolateUrl('/users/:id', { id: '123', extra: 'value' }) => /users/123
 */
export const interpolateUrl = <
  T extends string,
  P extends Record<ExtractPathParams<T>, string>,
>(
  url: T,
  params: P,
) => url.replace(/:(\w+)/g, (_, key) => params[key as keyof P]);
