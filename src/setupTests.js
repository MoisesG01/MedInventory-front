import "@testing-library/jest-dom";

// Mock global do IntersectionObserver para testes
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};
