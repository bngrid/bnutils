export default function bnthrottle(func, wait = 600) {
    let previous = 0;
    return function (...args) {
        const now = Date.now();
        if (now - previous > wait) {
            func.apply(null, args);
            previous = now;
        }
    };
}
