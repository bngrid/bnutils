type Option = {
    content: string;
    rate?: number;
    pitch?: number;
    end?: () => any;
    error?: () => any;
};
export default function bnvoice({ content, rate, pitch, end, error }: Option): void;
export {};
