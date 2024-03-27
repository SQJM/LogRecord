(function () {
    const {
        _INIT_PAGE_WebUtilPro_
    } = WebUtilPro;

    function Main() {
        WebGUIPro.render("./Lib/WebGUIPro");
        LogRecord_Main();
    }

    window.addEventListener("load", () => {
        _INIT_PAGE_WebUtilPro_(() => { Main() });
    });
})();


