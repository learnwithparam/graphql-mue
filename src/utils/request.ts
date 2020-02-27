import fetch from 'node-fetch';
import { cond, T, includes } from 'ramda';

/**
 * Parses the JSON returned by a network request
 */

function cleanStatus(response: any): any {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response;
}

function parseResponse(response: any): any {
  const contentType = response.headers.get('content-type');
  const parseBlob = () => response.blob();
  const parseJson = () => response.json();
  return cond([
    [includes('application/vnd.openxml'), parseBlob],
    [T, parseJson],
  ])(contentType);
}

/**
 * Checks if a network request came back fine, and throws an error if not
 */
function checkStatus(response: any): any {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Have to wrap correctly for fetch to throw errors correclty
 * @param {*} url
 * @param {*} options
 */
export function request(url: string, options: object): Promise<any> {
  return fetch(url, options)
    .then(checkStatus)
    .then(cleanStatus)
    .then(parseResponse);
}
