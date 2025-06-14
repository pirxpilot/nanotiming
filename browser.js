const scheduler = require('@pirxpilot/nanoscheduler')();
const assert = require('assert');

let perf;
nanotiming.disabled = true;
try {
  perf = window.performance;
  nanotiming.disabled = window.localStorage.DISABLE_NANOTIMING === 'true' || !perf.mark;
} catch {}

module.exports = nanotiming;

function nanotiming(name) {
  assert(typeof name === 'string', 'nanotiming: name should be type string');

  if (nanotiming.disabled) return noop;

  const uuid = (perf.now() * 10000).toFixed() % Number.MAX_SAFE_INTEGER;
  const startName = `start-${uuid}-${name}`;
  perf.mark(startName);

  function end(cb) {
    const endName = `end-${uuid}-${name}`;
    perf.mark(endName);

    scheduler.push(() => {
      let err = null;
      try {
        perf.measure(`${name} [${uuid}]`, startName, endName);
        perf.clearMarks(startName);
        perf.clearMarks(endName);
      } catch (e) {
        err = e;
      }
      if (cb) cb(err, name);
    });
  }

  end.uuid = uuid;
  return end;
}

function noop(cb) {
  if (cb) {
    scheduler.push(() => cb(new Error('nanotiming: performance API unavailable')));
  }
}
