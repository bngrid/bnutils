export default function bnchunk<T>(
  datas: T[] | number,
  func: (data: T, index: number) => any
) {
  if (typeof datas === 'number') {
    datas = new Array(datas)
  }
  if (!datas.length) {
    return
  }
  let index = 0
  function _bnf() {
    if (index === (<T[]>datas).length) {
      return
    }
    requestIdleCallback(idle => {
      while (idle.timeRemaining() && index < (<T[]>datas).length) {
        const data = (<T[]>datas)[index]
        func(data, index++)
      }
      _bnf()
    })
  }
  _bnf()
}
