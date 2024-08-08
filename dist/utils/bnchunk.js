export default function bnchunk(datas, func) {
    if (typeof datas === 'number') {
        datas = new Array(datas);
    }
    if (!datas.length) {
        return;
    }
    let index = 0;
    function _bnf() {
        if (index === datas.length) {
            return;
        }
        requestIdleCallback(idle => {
            while (idle.timeRemaining() && index < datas.length) {
                const data = datas[index];
                func(data, index++);
            }
            _bnf();
        });
    }
    _bnf();
}
