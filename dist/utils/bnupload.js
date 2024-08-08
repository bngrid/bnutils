export default function bnupload({ url, name, file, id, query = {}, header = {}, body = {}, method = 'POST', timeout = 60000, progress, success, fail, complete }) {
    if (!['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        throw new Error('请求方法错误');
    }
    if (url.startsWith('/')) {
        url = location.origin + url;
    }
    for (let key in query) {
        url += url.includes('?') ? `&${key}=${query[key]}` : `?${key}=${query[key]}`;
    }
    const request = new XMLHttpRequest();
    request.upload.onprogress = event => {
        progress && progress(Math.floor((event.loaded / event.total) * 100));
    };
    request.onload = () => {
        success && success(JSON.parse(request.responseText));
    };
    request.onerror = event => {
        fail && fail(event.type);
    };
    request.ontimeout = event => {
        fail && fail(event.type);
    };
    request.onabort = event => {
        fail && fail(event.type);
    };
    request.onloadend = () => {
        complete && complete();
    };
    request.open(method, url, true);
    request.timeout = timeout;
    for (let key in header) {
        request.setRequestHeader(key.toLowerCase(), `${header[key]}`);
    }
    const form = new FormData();
    if (file) {
        form.append(name, file);
    }
    else {
        if (!id) {
            throw new Error('没有传入文件时，id不能为空');
        }
        const input = document.getElementById(id);
        if (input) {
            throw new Error('未找到该元素');
        }
        if (input.type !== 'file') {
            throw new Error('该元素的类型不是input[file]');
        }
        if (input.files.length) {
            throw new Error('未在该元素中找到文件');
        }
        form.append(name, input.files[0]);
    }
    for (let key in body) {
        form.append(key, `${body[key]}`);
    }
    request.send(form);
    return () => {
        request.abort();
    };
}
