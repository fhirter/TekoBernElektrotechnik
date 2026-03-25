import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function renderToHtml(data) {
    const content = DOMPurify.sanitize(marked.parse(data), { USE_PROFILES: { html: true } });
    const document = `<!DOCTYPE html><body><h1>title</h1>${content}</body>`;
    return document;
}