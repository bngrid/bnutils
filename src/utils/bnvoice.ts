type Option = {
  content: string
  rate?: number
  pitch?: number
  end?: () => any
  error?: () => any
}

export default function bnvoice({ content, rate = 1, pitch = 1, end, error }: Option) {
  if (speechSynthesis.speaking) {
    return
  }
  if (content) {
    const utter = new SpeechSynthesisUtterance(content)
    utter.onend = () => {
      end && end()
    }
    utter.onerror = () => {
      error && error()
    }
    utter.voice = speechSynthesis.getVoices()[0]
    utter.rate = rate
    utter.pitch = pitch
    speechSynthesis.speak(utter)
  }
}
