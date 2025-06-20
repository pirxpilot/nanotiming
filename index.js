const assert = require('assert');

let perf;
nanotiming.disabled = true;
try {
  perf = require('perf_hooks').performance;
  nanotiming.disabled = process.env.DISABLE_NANOTIMING || !perf.mark;
} catch {}

module.exports = nanotiming;

function nanotiming(name) {
  if (typeof window !== 'undefined') return require('./browser.js')(name); // electron suport

  assert(typeof name === 'string', 'nanotiming: name should be type string');

  if (nanotiming.disabled) return noop;

  const uuid = (perf.now() * 10000).toFixed() % Number.MAX_SAFE_INTEGER;
  const startName = `start-${uuid}-${name}`;
  perf.mark(startName);

  function end(cb) {
    const endName = `end-${uuid}-${name}`;
    perf.mark(endName);

    let err = null;
    try {
      perf.measure(`${name} [${uuid}]`, startName, endName);
      perf.clearMarks(startName);
      perf.clearMarks(endName);
    } catch (e) {
      err = e;
    }
    if (cb) cb(err, name);
  }

  end.uuid = uuid;
  return end;
}

function noop(cb) {
  if (cb) {
    cb(new Error('nanotiming: performance API unavailable'));
  }
}
