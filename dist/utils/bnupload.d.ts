type Option = {
    url: string;
    name: string;
    file?: File;
    id?: string;
    query?: any;
    header?: any;
    body?: any;
    timeout?: number;
    method?: 'POST' | 'post' | 'PUT' | 'put' | 'PATCH' | 'patch';
    progress?: (percent: number) => any;
    success?: (data: any) => any;
    fail?: (type: string) => any;
    complete?: () => any;
};
export default function bnupload({ url, name, file, id, query, header, body, method, timeout, progress, success, fail, complete }: Option): () => void;
export {};
