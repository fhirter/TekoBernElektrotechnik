import { saveAs } from 'file-saver';

export function promptDownload(output, filename) {
    const blob = new Blob([output], {type: "text/plain"});
    saveAs(blob, filename);
}

export function openHtmlPopup(html, title = 'Preview', width = 800, height = 600) {
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const popup = window.open(
        url,
        title,
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    if (!popup) {
        URL.revokeObjectURL(url);
        alert('Popup was blocked by the browser. Please allow popups for this site.');
        return null;
    }

    // Clean up the object URL once the popup has loaded
    popup.addEventListener('load', () => URL.revokeObjectURL(url));

    return popup;
}