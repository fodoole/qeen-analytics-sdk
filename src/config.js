// TODO
export const config = {
  clickEvents: [{ 'label': 'H1', 'value': 'h1' }],
  scrollEvents: [{ 'label': 'BODY', 'value': 'body' }],
  idleTime: 10_000,
  projectId: '123',
  contentServingId: '0',
  contentId: '-',
  analyticsEndpoint: '/log',
  isPdp: true,
};

export const state = {
  sessionId: null,
  contentServed: false,
  debounceTime: 500,
  idleTimer: null,
  lastIdleTime: Date.now(),
  fodooleDeviceId: null,
  lastTabExitTime: 0,
  scrollObservedElements: [],
  debouncedEvents: [],
};
