import {renderToHtml} from "./renderToHtml";
import { it, expect, describe} from "vitest";


const markdown = `# title`;
const html = renderToHtml(markdown);

it('should return a html document', () => {
    expect(html).toContain('<!DOCTYPE html>');
});
it('should contain the given title', () => {
    expect(html).toContain('<h1>title</h1>');
});