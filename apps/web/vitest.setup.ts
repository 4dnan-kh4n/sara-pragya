import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "scrollTo", { value: () => undefined, writable: true });

if (!("IntersectionObserver" in globalThis)) {
  class IntersectionObserverMock {
    constructor(private readonly callback: IntersectionObserverCallback) {}

    observe(target: Element) {
      this.callback(
        [{
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 1,
          intersectionRect: {} as DOMRectReadOnly,
          isIntersecting: true,
          rootBounds: null,
          target,
          time: Date.now(),
        }],
        this as unknown as IntersectionObserver,
      );
    }

    disconnect() {}
    unobserve() {}
    takeRecords() { return []; }
  }

  globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;
}
