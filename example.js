const nanotiming = require('./')

try {
  const hooks = require('perf_hooks')
  const nanot = nanotiming('my-loop') // Start profiling

  let i = 10
  while (--i) console.log(i)

  // Stop profiling
  nanot()

  const timings = hooks.performance.getEntries()
  const timing = timings[timings.length - 1]
  console.log(timing.name, timing.duration) // log the last entry
  hooks.performance.clearMeasures(timing.name) // be a good citizen and free after use
} catch (e) {
  console.log('perf_hooks not available, exiting')
  process.exit(1)
}
