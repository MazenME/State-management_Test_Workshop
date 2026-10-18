import { jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals'

window.HTMLElement.prototype.scrollIntoView = jest.fn();