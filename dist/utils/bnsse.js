export default function bnsse({ url, method = 'GET', query = {}, header = {}, body = {}, message, open, error, close }) {
    if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())) {
        throw new Error('请求方法错误');
    }
    if (url.startsWith('/')) {
        url = location.origin + url;
    }
    for (let key in query) {
        url += url.includes('?') ? `&${key}=${query[key]}` : `?${key}=${query[key]}`;
    }
    const headers = {};
    for (let key in header) {
        headers[key] = header[key];
    }
    if (!('content-type' in headers)) {
        headers['content-type'] = 'application/json';
    }
    const controller = new AbortController();
    const signal = controller.signal;
    let flag = true;
    fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
        signal
    })
        .then(async (response) => {
        open && open();
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (flag) {
            const { done, value } = await reader.read();
            if (done) {
                close && close();
                break;
            }
            message && message(decoder.decode(value));
        }
    })
        .catch(err => {
        error && error(err);
    });
    return () => {
        flag = false;
        controller.abort();
    };
}
