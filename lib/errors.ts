// lib/errors.ts
export class HttpCookiesStoreError extends Error {
    constructor(message: string, public code?: string) {
      super(message);
      this.name = "HttpCookiesStoreError"; // Set the error name
      Object.setPrototypeOf(this, HttpCookiesStoreError.prototype);
    }
  }
  
  export class InvalidSiteValueError extends HttpCookiesStoreError {
    constructor(resource: string) {
      super(`${resource} is not a valid SiteValue`, "NOT_FOUND");
      this.name = "InvalidSiteValueError";
      Object.setPrototypeOf(this, InvalidSiteValueError.prototype);
    }
  }