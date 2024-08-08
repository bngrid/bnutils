export default function bnrandom(type, length = 6) {
    switch (type) {
        case 'color':
            return `#${Math.random().toString(16).substring(2, 8).padEnd(6, '0')}`;
        case 'code':
            if (length < 12) {
                return Math.random()
                    .toString(36)
                    .substring(2, length + 2)
                    .padEnd(length, '0');
            }
            else {
                return bnrandom('code', 11) + bnrandom('code', length - 11);
            }
        default:
            return '';
    }
}
