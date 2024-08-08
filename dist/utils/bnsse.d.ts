type Option = {
    url: string;
    method?: 'GET' | 'get' | 'POST' | 'post' | 'PUT' | 'put' | 'DELETE' | 'delete' | 'PATCH' | 'patch';
    query?: any;
    header?: any;
    body?: any;
    message?: (msg: string) => any;
    open?: () => any;
    error?: (err: string) => any;
    close?: () => any;
};
export default function bnsse({ url, method, query, header, body, message, open, error, close }: Option): () => void;
export {};
