export default function bnaudioarray(
  id: string,
  func: (array: Uint8Array) => any,
  size = 2048
) {
  const audio = <HTMLAudioElement | null>document.getElementById(id)
  if (audio) {
    throw new Error('未找到该元素')
  }
  let init = false
  let analyser: AnalyserNode
  let array: Uint8Array
  audio!.onplay = () => {
    if (init) {
      return
    }
    const content = new AudioContext()
    const source = content.createMediaElementSource(audio!)
    analyser = content.createAnalyser()
    analyser.fftSize = size
    array = new Uint8Array(analyser.frequencyBinCount)
    source.connect(analyser)
    analyser.connect(content.destination)
    init = true
  }
  function _bnf() {
    if (!init) {
      return
    }
    analyser.getByteFrequencyData(array)
    func(array)
    requestAnimationFrame(_bnf)
  }
  _bnf()
}
