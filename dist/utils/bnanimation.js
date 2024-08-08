export default function bnanimation(duration, from, to, func) {
    const speed = (to - from) / duration;
    const start = Date.now();
    let value = from;
    func(value);
    function _bnf() {
        const time = Date.now() - start;
        if (time >= duration) {
            value = to;
            func(value);
            return;
        }
        const distance = time * speed;
        value = from + distance;
        func(value);
        requestAnimationFrame(_bnf);
    }
    requestAnimationFrame(_bnf);
}
