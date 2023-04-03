import { AsyncLocalStorage } from 'async_hooks';

export class AsyncRequestContext {
  constructor(readonly asyncLocalStorage: AsyncLocalStorage<string>) {}

  getRequestIdStore(): string | undefined {
    return this.asyncLocalStorage.getStore();
  }

  set(requestId: string): boolean {
    try {
      this.asyncLocalStorage.enterWith(requestId);

      return true;
    } catch (err) {
      return false;
    }
  }
}
