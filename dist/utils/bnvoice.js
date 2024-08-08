export default function bnvoice({ content, rate = 1, pitch = 1, end, error }) {
    if (speechSynthesis.speaking) {
        return;
    }
    if (content) {
        const utter = new SpeechSynthesisUtterance(content);
        utter.onend = () => {
            end && end();
        };
        utter.onerror = () => {
            error && error();
        };
        utter.voice = speechSynthesis.getVoices()[0];
        utter.rate = rate;
        utter.pitch = pitch;
        speechSynthesis.speak(utter);
    }
}
