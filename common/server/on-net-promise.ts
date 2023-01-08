export const onNetPromise = <T>(
  eventName: string,
  func: (source?: number, ...args: any[]) => Promise<T> | T
): void => {
  onNet(eventName, async (respEventName: string, ...args: any[]) => {
    const src = global.source;

    if (!respEventName) {
      console.warn(`Promise event (${eventName}) was called with wrong struct by ${src} (maybe originator wasn't a promiseEvent`);
    }

    Promise.resolve(await func(src, ...args)).then((res: T) => {
      emitNet(respEventName, src, res);
    }).catch(err => console.error(`An error occured for a onNetPromise (${eventName}), Error: ${err.message}`));
  });
}
