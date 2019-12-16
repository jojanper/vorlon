/* eslint no-restricted-globals: 0 */
/* global self */
import { eventHandler } from './entry';

self.onmessage = event => eventHandler(event, self.postMessage);
