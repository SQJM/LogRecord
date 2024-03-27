/**
 * @name ExternalControl
 * @version 1.0.0
 * @description 外部控件
 * @license MIT
 * 
 * (c) 2023-12-29 Wang Jia Ming
 * 
 * https://opensource.org/licenses/MIT
 */
function ExternalControl_init(path) {
    let doc = null;
    const iframe = document.createElement("iframe");
    iframe.classList.add("ExternalControl");
    iframe.style.display = "none";
    iframe.src = path;
    iframe.onload = () => {
        doc = iframe.contentDocument;
    }
    MainWindow.appendChild(iframe);

    function get(str = "", i = null) {
        const at = str.charAt(0);
        const tag = str.substring(1, str.length);
        let ele = null;
        if (at === "#") {
            ele = doc.getElementById(tag);
        } else if (at === ".") {
            const elements = doc.getElementsByClassName(tag);
            ele = (i === null) ? elements : elements[i];
        }
        return ele.cloneNode(true);
    }

    return { get };
}