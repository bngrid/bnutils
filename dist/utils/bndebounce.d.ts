export default function bndebounce<A extends any[], R>(func: (...args: A) => R, wait?: number): (...args: A) => void;
