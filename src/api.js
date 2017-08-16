/* @flow */
type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type ApiOptions = {
  url: string,
  method?: Method,
  payload?: string | Object | null,
  customHeaders?: {
    [header: string]: any,
  },
  agent: any, // TODO - fix this
  debug?: boolean,
};
export default async function api<Output>({
  url,
  method = 'GET',
  payload = '',
  customHeaders = {},
  agent,
  debug = false,
}: ApiOptions): Promise<Output | string> {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  let options = {
    method,
    headers,
  };

  options =
    payload !== ''
      ? {
          ...options,
          body: payload._parts ? payload : JSON.stringify(payload),
        }
      : options;

  options = agent && url.indexOf('https://') > -1 ? { ...options, agent } : options;

  if (debug) {
    console.log('API: ', url, method, options.headers);
  }

  const response = await fetch(url, options);

  if (debug) {
    console.log('response: ', response);
  }

  if (response.ok) {
    let data;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return data;
  }

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  throw data;
}
