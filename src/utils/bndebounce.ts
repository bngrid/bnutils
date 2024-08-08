export default function bndebounce<A extends any[], R>(
  func: (...args: A) => R,
  wait = 600
): (...args: A) => void {
  let timeout: number
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = +setTimeout(() => {
      func.apply(null, <A>args)
    }, wait)
  }
}
