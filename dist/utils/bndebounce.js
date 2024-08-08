export default function bndebounce(func, wait = 600) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = +setTimeout(() => {
            func.apply(null, args);
        }, wait);
    };
}
