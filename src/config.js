export class Config {
  // FIXME: create a local testing config file
  // static analyticsEndpoint = '/log';
  // static projectId = '123';
  // static contentServingId = '0';
  // static contentId = '-';
  // static isPdp = true;
  // static idleTime = 10_000;
  // static clickEvents = [{ 'label': 'H1', 'value': 'h1' }];
  // static scrollEvents = [{ 'label': 'BODY', 'value': 'body' }];
  // FIXME: reconsider the format of the following
  // static rawContentSelectors = [{ 'uid': '0001', 'path': '.title', 'value': 'TITLE REPLACED' }];
  // static contentSelectors = {};
  // static titleContent = '';
}

export class State {
  static reset() {
    State.contentServed = false;
    State.sessionId = null;
    State.isResetSession = false;
    State.debounceTime = 500;
    State.idleTimer = null;
    State.lastIdleTime = Date.now();
    State.fodooleDeviceId = null;
    State.lastTabExitTime = 0;
    State.scrollObservedElements = new Set();
  }
}
