export default function bnthrottle<A extends any[], R>(
  func: (...args: A) => R,
  wait = 600
): (...args: A) => void {
  let previous = 0
  return function (...args: any[]) {
    const now = Date.now()
    if (now - previous > wait) {
      func.apply(null, <A>args)
      previous = now
    }
  }
}
