document.addEventListener("keydown", function(e) {

    // enable/disable with CTRL+SHIFT
    if (e.ctrlKey && e.shiftKey) {
        cyboard.enabled = !cyboard.enabled;
        console.log(`cyboard: cyrillic mode ${cyboard.enabled ? "enabled" : "disabled" }`);
        return;
    }

    if (!cyboard.enabled) return;

    // if printable character
    if (e.key.length === 1) {
        const lower = e.key.toLowerCase();

        if (window.cyboard.CYRILLIC_MAP[lower]) {
            e.preventDefault();
            e.stopPropagation();

            let out = window.cyboard.CYRILLIC_MAP[lower];

            // output uppercase if shift is pressed
            if (e.shiftKey) {
                out = out.toUpperCase();
            }

            insertText(out);
        }
    }

}, true); // catch early


function insertText(text) {
    const active = document.activeElement;

    if (active && active.isContentEditable) {
        document.execCommand("insertText", false, text);

        return;
    }

    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
        const start = active.selectionStart;
        const end = active.selectionEnd;

        const before = active.value.substring(0, start);
        const after  = active.value.substring(end);

        active.value = before + text + after;

        // set cursor
        active.selectionStart = active.selectionEnd = start + text.length;

        active.dispatchEvent(new Event("input", { bubbles: true }));

        return;
    }

    // fallback to original
    document.execCommand("insertText", false, text);
}
