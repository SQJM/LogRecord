/**
 * @name WebGUIPro
 * @version 1.0.0
 * @description 网页控件
 * @license MIT
 * 
 * (c) 2023-12-29 Wang Jia Ming
 * 
 * https://opensource.org/licenses/MIT
 * 
 * 依赖库/框架:
 * - WebUtilPro.js (1.0.0)
 */
const WebGUIPro = (function () {
    const {
        $,
        getAppointParent,
        forEnd,
        addDraggable,
        elementAnimation,
        generateUniqueId,
        getElementScreenPosition,
        RangeCorrection,
        includeCssFiles,
        UniquenessElement,
        createElement
    } = WebUtilPro;

    const _W_Event = (eventName, btn = 0) => {
        return new MouseEvent(eventName, {
            bubbles: true,     // 事件是否冒泡
            cancelable: true,  // 是否可以被取消
            view: window,      // 与事件相关的抽象视图
            button: btn        // 按下哪个鼠标键（0：主鼠标键，1：中间的鼠标键，2：次要的鼠标键）
        });
    }

    const _Animation_List = [];

    class w_list_widget {
        init(Control) {
            if (Control === null) { return }
            function Select(SelectElement, EventName) {
                if (Control.hasAttribute("low")) return;
                ClearAllSelect();
                SelectElement.setAttribute("select", "");
                Control.wSelectItem = SelectElement;
                Control.wSelectItemText = SelectElement.$(".w-text")[0].innerHTML;
                Control.wEvent_Select(SelectElement, EventName);
            }
            function InitSortNumber() {
                forEnd(Control.$(">.w-item"), (e, i) => {
                    e.setAttribute("w-index", i);
                });
            }
            function GetItem(index) {
                if (_WebUtilPro_isNumber(index)) {
                    index = index.toString();
                    return forEnd(Control.$(">.w-item"), (e) => { return e.getAttribute("w-index") === index });
                } else {
                    return forEnd(Control.$(">.w-item"), (e) => { return e.$(".w-text")[0].innerHTML.toString() === index });
                }
            }
            function ClearAllSelect() {
                Control.$(">[select]").forEach(e => {
                    e.removeAttribute("select");
                });
            }

            Control.wEvent_Select = () => { }
            Control.wEvent_Hover = () => { }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }
            Control.wSelect = (index) => {
                const e = GetItem(index);
                if (!e) return null;
                if (Control.getAttribute("WEvent") === "click") {
                    e.dispatchEvent(_W_Event("click"));
                }
                else if (Control.getAttribute("WEvent") === "mousedown") {
                    e.dispatchEvent(_W_Event("mousedown"));
                }
                return e;
            }
            Control.wAddItemElement = (item) => {
                Control.appendChild(item);
                InitSortNumber();
            }
            Control.wAddItem = (text, imgSrc = "") => {
                const div = document.createElement("div");
                div.className = "w-item";
                const span = document.createElement("span");
                span.className = "w-text";
                span.innerText = text;
                const img = document.createElement("img");
                img.className = "w-icon";
                img.src = imgSrc;
                if (imgSrc !== "") div.appendChild(img);
                div.appendChild(span);
                Control.wAddItemElement(div);
                return [div, img, span];
            }
            Control.wRemove = (index) => {
                GetItem(index).remove();
                InitSortNumber();
            }
            if (!Control.hasAttribute("WEvent")) {
                Control.setAttribute("WEvent", "mousedown");
            }

            Control.wAddWEventListener("click", (event) => {
                const TargetElement = event.target;
                let CurrentElement = getAppointParent(TargetElement, (e) => { return e.parentNode === Control });

                if (CurrentElement === null ||
                    !CurrentElement.classList.contains("w-item") ||
                    CurrentElement.hasAttribute("disabled")) {
                    return;
                }

                Select(CurrentElement, _WebUtilPro_event.click);
            }, () => {
                const s = Control.$(">[select]")[0];
                if (s) {
                    s.dispatchEvent(_W_Event("click"));
                }
            });

            Control.wAddWEventListener("mousedown", (event) => {
                const TargetElement = event.target;
                let CurrentElement = getAppointParent(TargetElement, (e) => { return e.parentNode === Control });

                if (CurrentElement === null ||
                    !CurrentElement.classList.contains("w-item") ||
                    CurrentElement.hasAttribute("disabled")) {
                    return;
                }

                Select(CurrentElement, _WebUtilPro_event.mousedown);
            }, () => {
                const sel = Control.$(">[select]")[0];
                if (sel) sel.dispatchEvent(_W_Event("mousedown"));
            });

            Control.wAddSoleEventListener("mouseover", (event) => {
                const TargetElement = event.target;
                let CurrentElement = getAppointParent(TargetElement, (e) => { return e.parentNode === Control });

                if (CurrentElement === null ||
                    !CurrentElement.classList.contains("w-item") ||
                    CurrentElement.hasAttribute("disabled")) {
                    return;
                }

                Control.wEvent_Hover(CurrentElement);
            });

            InitSortNumber();
            if (Control.hasAttribute("low")) ClearAllSelect();
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_tab_widget {
        init(Control) {
            if (Control === null) { return }
            const bar = Control.$(".w-bar")[0];
            const content = Control.$(".w-content")[0];
            const tab = Control.$(".w-tabs")[0];

            function GoIndex() {
                const ei = forEnd(tab.$(">.w-tab"), (e) => { return e.getAttribute("w-tab") === Control.wSelectTabIndex });
                if (ei) {
                    content.innerHTML = null;
                    const fragment = document.createDocumentFragment();
                    fragment.appendChild(ei.cloneNode(true));
                    content.appendChild(fragment);
                }
            }
            function TabSort() {
                forEnd(tab.$(">.w-tab"), (e, i) => {
                    e.setAttribute("w-tab", i);
                });
                forEnd(bar.$(">.w-tab-title"), (e, i) => {
                    e.setAttribute("w-tab-index", i);
                });
            }
            function Select(SelectElement) {
                if (SelectElement === null || SelectElement.hasAttribute("disabled")) {
                    content.innerHTML = null;
                    return;
                }
                SelectElement.setAttribute("select", "");
                Control.wSelectTab = SelectElement;
                Control.wSelectTabIndex = SelectElement.getAttribute("w-tab-index");
                GoIndex();
                Control.wEvent_Select(SelectElement);
            }
            function DeleteTab(TargetElement) {
                let CurrentElement = TargetElement.parentNode;
                const isSelectCurrentElement = CurrentElement.hasAttribute("select");
                const previous = CurrentElement.previousElementSibling;
                const next = CurrentElement.nextElementSibling;
                const index = CurrentElement.getAttribute("w-tab-index");
                let isRemove = false;
                forEnd(tab.$(">.w-tab"), (e) => {
                    if (e.getAttribute("w-tab") === index) {
                        e.remove();
                        CurrentElement.remove();
                        isRemove = true;
                    }
                });
                if (isRemove) {
                    TabSort();
                    if (isSelectCurrentElement) {
                        const tabs = tab.$(">.w-tab");
                        if (tabs.length === 0) {
                            Select(null);
                        } else if (previous) {
                            Select(previous);
                        } else if (next) {
                            Select(next);
                        }
                    }
                }
            }
            function InitDelete() {
                forEnd(bar.$(">.w-tab-title"), (e) => {
                    forEnd(e.$(">.w-delete"), (e) => { e.remove() });
                    if (e.hasAttribute("delete")) {
                        e.appendChild(createElement({
                            tagName: "i",
                            classList: ["material-icons", "w-delete"],
                            html: "&#xe5cd;",
                        }));
                    }
                });
            }
            function GetTabTitle(index) {
                index = index.toString();
                return forEnd(bar.$(">.w-tab-title"), (e) => { return e.getAttribute("w-tab-index") === index });
            }

            content.innerHTML = null;
            Control.wSelectTabIndex = bar.$(">[select]")[0].getAttribute("w-tab-index");
            Control.wEvent_Select = (e) => { }
            Control.wSelect = (index) => { GetTabTitle(index).dispatchEvent(_W_Event("mousedown")) }
            Control.wSetDelete = (index, is) => {
                const e = GetTabTitle(index);
                if (is)
                    e.setAttribute("delete", "");
                else
                    e.removeAttribute("delete");
                InitDelete();
            }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            function mousedownFn(event) {
                const TargetElement = event.target;
                let CurrentElement = getAppointParent(TargetElement, (e) => { return e.parentNode === bar });
                if (CurrentElement && CurrentElement !== null && CurrentElement.classList.contains("w-tab-title")) {
                    if (TargetElement.classList.contains('w-delete') &&
                        TargetElement.parentNode.parentNode === bar ||
                        TargetElement.hasAttribute("disabled")) {
                        return;
                    }
                    forEnd(bar.$(">[select]"), (e) => {
                        e.removeAttribute("select");
                    });
                    Select(CurrentElement);
                }
            }
            function clickFn(event) {
                const TargetElement = event.target;
                let CurrentElement = getAppointParent(TargetElement, (e) => { return e.parentNode === bar });
                if (CurrentElement && CurrentElement !== null && CurrentElement.classList.contains("w-tab-title")) {
                    if (!TargetElement.classList.contains('w-delete') ||
                        TargetElement.parentNode.parentNode !== bar ||
                        TargetElement.parentNode.hasAttribute("disabled")) {
                        return;
                    }
                    DeleteTab(TargetElement);
                }
            }
            bar.wAddsSoleEventListener(["mousedown", "click"], [mousedownFn, clickFn]);

            InitDelete();
            GoIndex();
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_stacked_widget {
        init(Control) {
            if (Control === null) { return }
            function ClearAllSelect() {
                forEnd(Control.$(">[select]"), (e) => { e.removeAttribute("select") });
            }
            function GetStacked(index) {
                return Control.$(`>[w-stacked-index=${index}]`)[0];
            }
            function InitSortNumber() {
                forEnd(Control.$(">.w-stacked"), (e, i) => { e.setAttribute("w-stacked-index", i) });
            }
            function AddStacked() {
                const div = document.createElement("div");
                div.className = "w-stacked";
                Control.appendChild(div);
                InitSortNumber();
            }
            function RemoveStacked(index) {
                GetStacked(index).remove();
                InitSortNumber();
            }
            function Select() {
                ClearAllSelect();
                const stacked = GetStacked(Control.wSelectStackedIndex);
                stacked.setAttribute("select", "");
            }

            Control.wSelectStackedIndex = Control.$(">[select]")[0].getAttribute("w-stacked-index");
            Control.wSelect = (index) => {
                Control.wSelectStackedIndex = index.toString();
                Select();
            }
            Control.wAddStacked = () => { AddStacked() }
            Control.wRemoveStacked = (index) => { RemoveStacked(index) }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            Select();
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_combo_box {
        init(Control) {
            if (Control === null) { return }
            const content = Control.$(".w-content")[0];
            const list = Control.$(".w-list")[0];
            const listw = list.$("div")[0];
            const input = content.$(".w-line-edit")[0];
            const btn = Control.$("button")[0];

            const activityEventName = `w-combo-box-content-${Control.SoleID}`;

            function SetState() {
                if (Control.wState) {
                    Control.wState = false;
                    if (Control.wBlocking) list.setAttribute("state", "hidde"); else {
                        forEnd($("." + activityEventName), (e) => { e.remove() });
                    }
                } else {
                    Control.wState = true;
                    if (Control.wBlocking) list.setAttribute("state", "show"); else {
                        const xy = getElementScreenPosition(Control);
                        const menuElement = new w_activity_widget({
                            x: xy.x,
                            y: xy.y,
                            EventName: activityEventName,
                            content: listw.cloneNode(true)
                        });
                        menuElement.wDelete = () => {
                            Control.wState = false;
                            btn.wSetState(false);
                            menuElement.remove();
                        }
                        const lis = new w_list_widget(menuElement.$(".w-content")[0].$("div")[0]).Element;
                        lis.wEvent_Select = (e, EventName) => {
                            if (EventName === "click") {
                                listw.wSelect(parseInt(e.getAttribute("w-index")));
                                input.wSetValue(listw.wSelectItemText);
                                Control.wValue = input.wValue;
                                if (!listw.wSelectItemText) {
                                    input.wClearValue();
                                }
                                Control.wEvent_Select(Control.wValue);
                            }
                        }
                    }
                }
                btn.wSetState(Control.wState);
            }

            Control.wList = listw;
            Control.wBlocking = false;

            Control.wEvent_Select = () => { }
            Control.wSetBlocking = (is) => {
                Control.wBlocking = is;
                if (!is) forEnd($("." + activityEventName), (e) => { e.remove() });
            }
            Control.wSelect = (index) => { listw.wSelect(index); btn.click() }
            Control.wSetBtnVisibility = (is) => { is ? btn.style.display = "inline-flex" : btn.style.display = "none" }
            Control.wSetInputVisibility = (is) => { is ? input.style.display = "inline-flex" : input.style.display = "none" }
            Control.wSetDisabled = (is) => {
                btn.wSetDisabled(is);
                input.wSetDisabled(is);
            }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            input.wInput.w_Event = (event) => { if (event.wEventName === "click") SetState() }
            btn.wEvent_Click = () => { SetState() }
            listw.wEvent_Select = (e, EventName) => {
                if (EventName === "click") {
                    btn.click();
                    input.wSetValue(listw.wSelectItemText);
                    Control.wValue = input.wValue;
                    if (!listw.wSelectItemText) {
                        input.wClearValue();
                    }
                    Control.wEvent_Select(Control.wValue);
                }
            }

            input.wSetReadOnly(true);
            input.wSetValue(listw.wSelectItemText);
            Control.wValue = input.wValue;
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_line_edit {
        init(Control) {
            if (Control === null) { return }
            const input = Control.$("input")[0];

            Control.wInput = input;
            Control.wValue = input.value;
            Control.wType = input.type;

            Control.wEvent_Input = () => { }
            Control.wSetDisabled = (is) => { is ? input.setAttribute("disabled", "") : input.removeAttribute("disabled") }
            Control.wSetReadOnly = (is) => { is ? input.setAttribute("readonly", "") : input.removeAttribute("readonly") }
            Control.wSetPlaceholder = (value) => { input.placeholder = value }
            Control.wClearValue = () => { Control.wSetValue("") }
            Control.wSetValue = (value) => {
                Control.wValue = value;
                input.value = value;
            }
            Control.wSetType = (value) => {
                input.type = value;
            }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }
            Control.wFocus = () => { input.focus() }

            input.w_Event = (event) => {
                if (event.wEventName === "input") {
                    if (input.type === "number" && input.value !== "") {
                        let max, min;
                        if (input.hasAttribute("max")) {
                            max = parseInt(input.getAttribute("max"));
                        }
                        if (input.hasAttribute("min")) {
                            min = parseInt(input.getAttribute("min"));
                        }
                        if (max !== undefined && input.value > max) {
                            input.value = max;
                        } else if (min !== undefined && input.value < min) {
                            input.value = min;
                        }
                    }
                    Control.wValue = input.value;
                    Control.wEvent_Input(input.value);
                }
            }
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_bool_button {
        init(Control) {
            if (Control === null) { return }
            Control.wSetState = (is) => { Control.setAttribute("state", is) }
            Control.wSetDisabled = (is) => { is ? Control.setAttribute("disabled", "") : Control.removeAttribute("disabled") }
            Control.wEvent_Click = (e) => { }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            function clickFn(event) {
                const TargetElement = event.target;
                let CurrentElement = getAppointParent(TargetElement, (e) => { return e.parentNode === Control });
                if (CurrentElement !== null) {
                    Control.setAttribute("state", Control.getAttribute("state") === "true" ? "false" : "true");
                    Control.wEvent_Click(_WebUtilPro_strToBoolean(Control.getAttribute("state")));
                }
            }
            Control.wAddSoleEventListener("click", clickFn);
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_animation_widget {
        init(Control) {
            if (Control === null) { return }
            const anName = Control.getAttribute("WAnimationName");
            const Animation = forEnd(_Animation_List, (e) => { return e[0] === anName });

            function Run() { if (Animation) Animation[1](Control) }

            Control.wClear = () => { Control.innerHTML = null }
            Control.wSetModel = (model) => { Control.setAttribute("WShowModel", model) }
            Control.wSetAnimation = (name) => { Control.setAttribute("WAnimationName", name) }
            Control.wReset = () => {
                Control.wClear();
                Run();
            }
            Control.wEnd = () => { Control.wClear() }
            Control.wStop = () => { }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            if (!Control.hasAttribute("WShowModel")) { Control.setAttribute("WShowModel", _WebUtilPro_window_model.default) }

            if (Control.hasAttribute("WShowTime")) {
                setTimeout(() => { Control.wEnd() }, parseInt(Control.getAttribute("WShowTime")));
            }

            Run();
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_text_edit {
        init(Control) {
            if (Control === null) { return }
            Control.wSetDisabled = (is) => { is ? Control.setAttribute("disabled", "") : Control.removeAttribute("disabled") }
            Control.wSetResize = (value) => { Control.style.resize = value }
            Control.wSetReadOnly = (is) => { is ? Control.setAttribute("readonly", "") : Control.removeAttribute("readonly") }
            Control.wSetPlaceholder = (value) => { Control.placeholder = value }
            Control.wSetValue = (value) => { Control.value = value }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }
            Control.wFocus = () => { Control.focus() }

            Control.wSetResize(_WebUtilPro_window_operation.default);
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_text_read {
        init(Control) {
            if (Control === null) { return }
            Control.wSetResize = (value) => { Control.style.resize = value }
            Control.wSetPlaceholder = (value) => { Control.placeholder = value }
            Control.wSetValue = (value) => { Control.value = value }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            Control.wSetResize(_WebUtilPro_window_operation.default);
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_line_read {
        init(Control) {
            if (Control === null) { return }
            const input = Control.$("input")[0];

            Control.wInput = input;
            Control.wValue = input.value;
            Control.wType = input.type;

            Control.wSetPlaceholder = (value) => { input.placeholder = value }
            Control.wSetValue = (value) => {
                Control.wValue = value;
                input.value = value;
            }
            Control.wSetType = (value) => { input.type = value }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_switch_button {
        init(Control) {
            if (Control === null) { return }
            const input = Control.$("input")[0];

            function SetState(is = null) {
                if (is === null) {
                    input.checked = !input.checked;
                    Control.setAttribute("state", input.checked);
                    return;
                }
                Control.setAttribute("state", is);
                input.checked = is;
            }

            Control.wState = () => { return input.checked }
            Control.wSetState = (is) => { SetState(is) }
            Control.wSetFine = (is) => { is ? Control.setAttribute("fine", "") : Control.removeAttribute("fine") }
            Control.wSetDisabled = (is) => { is ? input.setAttribute("disabled", "") : input.removeAttribute("disabled") }
            Control.wEvent_Click = (e) => { }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            Control.w_Event = (event) => {
                if (event.wEventName === "click") {
                    const TargetElement = event.target;
                    if (input.hasAttribute("disabled")) return;
                    let CurrentElement = getAppointParent(TargetElement, (e) => { return e.parentNode === Control });
                    if (CurrentElement !== null) {
                        SetState();
                        Control.wEvent_Click(_WebUtilPro_strToBoolean(Control.getAttribute("state")));
                    }
                }
            }
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_progress_bar {
        init(Control) {
            if (Control === null) { return }
            const input = Control.$("input")[0];
            const unit = Control.$(".w-unit")[0];
            const space = Control.$(".w-space")[0];
            const bar = Control.$(".w-bar")[0];

            function SetProgress() {
                unit.innerText = `${input.value}%`;
                bar.style.width = `${input.value}%`;
            }
            function SetValue(value) {
                input.value = value;
                SetProgress();
            }

            Control.wSetDisabled = (is) => { is ? input.setAttribute("disabled", "") : input.removeAttribute("disabled") }
            Control.wSetFlipped = (is) => { is ? Control.setAttribute("flipped", "") : Control.removeAttribute("flipped") }
            Control.wSetRotate = (is) => { is ? Control.setAttribute("rotate", "") : Control.removeAttribute("rotate") }
            Control.wSetValue = (value) => { SetValue(value) }
            Control.wSetSpaceVisibility = (is) => { space.setVisibility(is) }
            Control.wSetUnitVisibility = (is) => { is ? unit.style.display = "block" : unit.style.display = "none" }
            Control.wSetStep = (value) => { input.step = value }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            input.w_Event = (event) => { if (event.wEventName === "input") SetProgress() }

            SetProgress();
            Control.wSetUnitVisibility(false);
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_dialog {
        init(Control) {
            if (Control === null) { return }
            const box = Control.$(".w-box")[0];
            const title = box.$(".w-title")[0];
            const content = box.$(".w-content")[0];
            const btns = box.$(".w-btns")[0];
            const del = title.$(".w-delete")[0];

            Control.wSetTitle = (str) => { title.innerText = str }
            Control.wSetContent = (element) => {
                content.innerHTML = null;
                if (_WebUtilPro_isString(element)) {
                    content.innerHTML = element;
                } else if (_WebUtilPro_isHTMLElement(element)) {
                    content.appendChild(element);
                }
            }
            Control.wEvent_Click = () => { }
            Control.wSetWidth = (width) => { if (width) box.style.width = width }
            Control.wSetHeight = (height) => { if (height) box.style.height = height }
            Control.wSetDeleteBtnVisibility = (is) => { is ? del.style.display = "block" : del.style.display = "none" }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }
            Control.wSetBlocking = (is) => { is ? Control.setAttribute("blocking", "") : Control.removeAttribute("blocking") }

            Control.w_Event = (event) => {
                if (event.wEventName === "click" && !Control.hasAttribute("blocking")) {
                    Control.remove();
                }
            }
            del.w_Event = (event) => {
                if (event.wEventName === "click") {
                    Control.remove();
                }
            }

            btns.wAddSoleEventListener("click", (event) => {
                const TargetElement = event.target;
                let CurrentElement = getAppointParent(TargetElement, (e) => { return e.parentNode === btns });
                if (CurrentElement) {
                    Control.wEvent_Click(event, CurrentElement);
                }
            });
        }

        constructor({
            EventName = generateUniqueId(),
            title = "w",
            content = null,
            copyContent = false,
            isBlocking = false,
            isDeleteBtn = true,
            btns = [],
            contentRender = true,
            isDraggable = false,
            draggableMarginLimit = {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            width = null,
            height = null,
            container = MainWindow
        }) {
            UniquenessElement($("." + EventName));
            const fragment = document.createDocumentFragment();
            const dialogContainer = document.createElement('div');
            dialogContainer.className = 'w-dialog ' + EventName;
            dialogContainer.EventName = EventName;

            const boxElement = document.createElement('div');
            boxElement.className = 'w-box';

            const titleElement = document.createElement('p');
            titleElement.className = 'w-title';
            titleElement.innerText = title;

            const deleteIconElement = document.createElement('i');
            deleteIconElement.className = 'material-icons w-delete';
            deleteIconElement.innerHTML = "&#xe5cd;";

            titleElement.appendChild(deleteIconElement);

            const contentElement = document.createElement('div');
            contentElement.className = 'w-content';
            if (copyContent) {
                contentElement.style.userSelect = "text";
            }

            const btnsElement = document.createElement('div');
            btnsElement.className = 'w-btns';

            boxElement.appendChild(titleElement);
            boxElement.appendChild(contentElement);
            boxElement.appendChild(btnsElement);

            dialogContainer.appendChild(boxElement);

            fragment.appendChild(dialogContainer);
            container.appendChild(fragment);
            this.init(dialogContainer);
            { // init
                dialogContainer.wSetBlocking(isBlocking);
                dialogContainer.wSetDeleteBtnVisibility(isDeleteBtn);
                dialogContainer.wSetContent(content);
                dialogContainer.wSetWidth(width);
                dialogContainer.wSetHeight(height);
                forEnd(btns, (e) => {
                    if (_WebUtilPro_isString(e)) {
                        const btn = document.createElement("button");
                        btn.innerText = e;
                        btn.className = "w-button";
                        btnsElement.appendChild(btn);
                    } else if (_WebUtilPro_isArray(e)) {
                        const btn = document.createElement("button");
                        btn.className = "w-button";
                        if (_WebUtilPro_isString(e[2])) {
                            btn.classList.add(e[2]);
                        } else if (_WebUtilPro_isObject(e[2])) {
                            btn.setStyle(e[2]);
                        }
                        if (_WebUtilPro_isString(e[3])) {
                            btn.setAttribute("WShortcutKey", e[3]);
                            dialogContainer.addEventListener("keydown", (event) => {
                                if (event.key === e[3]) {
                                    btn.click();
                                }
                            });
                        }
                        btn.innerText = e[0];

                        btn.w_Event = (event) => {
                            if (event.wEventName === "click") {
                                if (e[1]() === false) dialogContainer.remove();
                            }
                        };
                        btnsElement.appendChild(btn);
                    } else if (_WebUtilPro_isHTMLElement(e)) {
                        btnsElement.appendChild(e);
                    }
                });
                if (isDraggable) {
                    function getLimit(dialogContainer, boxElement) {
                        const top = -((dialogContainer.offsetHeight / 2) - (boxElement.offsetHeight / 2)) + (draggableMarginLimit.top || 0);
                        const left = -((dialogContainer.offsetWidth / 2) - (boxElement.offsetWidth / 2)) + (draggableMarginLimit.left || 0);
                        const right = ((dialogContainer.offsetWidth / 2) - (boxElement.offsetWidth / 2)) - (draggableMarginLimit.right || 0);
                        const bottom = ((dialogContainer.offsetHeight / 2) - (boxElement.offsetHeight / 2)) - (draggableMarginLimit.bottom || 0);
                        return { top, left, right, bottom };
                    }

                    function addResizeObserver(dialogContainer, boxElement, dr) {
                        const resizeObserver = new ResizeObserver(() => {
                            dr.updateLimit(getLimit(dialogContainer, boxElement));
                        });
                        resizeObserver.observe(dialogContainer);
                        resizeObserver.observe(boxElement);
                    }

                    const draggable = new addDraggable({
                        element: titleElement,
                        effectElement: boxElement,
                        fn: () => true,
                        limit: getLimit(dialogContainer, boxElement),
                    });

                    addResizeObserver(dialogContainer, boxElement, draggable);
                }
                if (_WebUtilPro_isHTMLElement(content) && contentRender) {
                    resetRender(content);
                }
            }
            this.Element = dialogContainer;
            return dialogContainer;
        }
    }

    class w_activity_widget {
        init(Control) {
            if (Control === null) { return }

            const content = Control.$(".w-content")[0];

            Control.wContent = content;

            Control.wSetContent = (e) => {
                if (_WebUtilPro_isString(e)) {
                    content.innerText = e;
                } else if (_WebUtilPro_isHTMLElement(e)) {
                    content.appendChild(e);
                }
            }
            Control.wSetXY = (x = 0, y = 0) => {
                if (x < 0 || y < 0) {
                    if (y < 0)
                        content.style.top = `0`;
                    if (x < 0)
                        content.style.left = `0`;
                    return;
                }
                const xy = RangeCorrection(x, y, content);
                content.style.top = `${xy[0] - 4}px`;
                content.style.left = `${xy[1] - 4}px`;
            }
            Control.wSetBlocking = (is) => { is ? Control.setAttribute("blocking", "") : Control.removeAttribute("blocking") }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            Control.w_Event = (event) => {
                if (event.wEventName === "click" && !Control.hasAttribute("blocking")) {
                    Control.wDelete();
                }
            }
        }

        constructor({
            EventName = generateUniqueId(),
            x = 0,
            y = 0,
            content = null,
            isBlocking = false,
            contentRender = true,
            container = MainWindow
        }) {
            UniquenessElement($("." + EventName));
            const fragment = document.createDocumentFragment();
            const activityContainer = document.createElement("div");
            activityContainer.EventName = EventName;
            activityContainer.className = "w-activity-widget " + EventName;

            const contentElement = document.createElement("div");
            contentElement.className = "w-content";

            activityContainer.appendChild(contentElement);

            this.init(activityContainer);
            { // init
                activityContainer.wSetBlocking(isBlocking);
                activityContainer.wSetContent(content);
                if (_WebUtilPro_isHTMLElement(content) && contentRender) {
                    resetRender(content);
                }
            }

            fragment.appendChild(activityContainer);
            container.appendChild(fragment);

            activityContainer.wSetXY(x, y);
            this.Element = activityContainer;
            return activityContainer;
        }
    }

    class w_context_menu {
        init(Control) {
            if (Control === null) { return }

            const content = Control.$(".w-content")[0];

            Control.wEvent_Select = () => { }

            function addItem(data = []) {
                // 创建外层 div 元素
                const wItem = document.createElement('div');
                wItem.classList.add('w-item');

                if (data[5]) wItem.onclick = data[5];

                // 创建左侧元素
                const left = document.createElement('div');
                left.classList.add('left');

                const img = document.createElement('span');
                img.classList.add('img', 'material-icons');
                if (data[1]) {
                    img.style.backgroundImage = `url(${data[1]})`;
                } else if (data[2]) {
                    img.textContent = data[2];
                }

                const text = document.createElement('span');
                text.classList.add('text');
                text.textContent = data[0];

                left.appendChild(img);
                left.appendChild(text);

                // 创建右侧元素
                const right = document.createElement('div');
                right.classList.add('right');

                const shortcutKey = document.createElement('span');
                shortcutKey.classList.add('shortcut-key');
                let keystr = "";
                forEnd(data[3], (e) => { keystr += `${e}+` });
                shortcutKey.textContent = keystr.slice(0, -1);

                const pattern = document.createElement('span');
                pattern.classList.add('pattern', 'material-icons');
                if (data[4]) {
                    const sunNode = data[4];
                    pattern.textContent = '\ue409';
                    sunNode.wSetBlocking(false);
                    wItem.onmouseover = function () {
                        forEnd($(".w_context_menu_sun_node"), (e) => { e.remove() });
                        const clone = sunNode.cloneNode(true);
                        clone.addEventListener("mousedown", (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        clone.classList.add("w_context_menu_sun_node");
                        if ($("." + clone.getAttribute("sunnode")).length > 0) return;
                        new w_context_menu({ render: true }).init(clone);
                        const xy = getElementScreenPosition(pattern);
                        clone.wSetXY(xy.x + pattern.offsetWidth, xy.y);
                        MainWindow.appendChild(clone);
                    };
                }

                right.appendChild(shortcutKey);
                right.appendChild(pattern);

                wItem.appendChild(left);
                wItem.appendChild(right);
                return wItem;
            }

            Control.wAddItem = ({
                text = "",
                img = null,
                fontImg = null,
                key = [],
                sunNode = null,
                callback = null
            }) => {
                content.appendChild(addItem([text, img, fontImg, key, sunNode, callback]));
            }
            Control.wAddHr = (hr) => {
                content.appendChild(createElement({
                    classList: ["w-hr"]
                }));
            }
            Control.wAddItems = (arr) => {
                forEnd(arr, (e) => {
                    if (e === null) {
                        Control.wAddHr(e)
                    } else {
                        Control.wAddItem(e)
                    }
                });
            }
            Control.wSetXY = (x = 0, y = 0) => {
                let moveElement = Control;
                if (Control.hasAttribute("blocking")) moveElement = content;
                if (x < 0 || y < 0) {
                    if (y < 0)
                        moveElement.style.top = `0`;
                    if (x < 0)
                        moveElement.style.left = `0`;
                    return;
                }
                const xy = RangeCorrection(x, y, moveElement);
                moveElement.style.top = `${xy[0]}px`;
                moveElement.style.left = `${xy[1]}px`;
            }
            Control.wSetBlocking = (is) => { is ? Control.setAttribute("blocking", "") : Control.removeAttribute("blocking") }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                if (!Control.hasAttribute("sunnode")) {
                    forEnd($("." + Control.EventName), (e) => { e.remove() });
                }
                MainWindow.removeEventListener("mousedown", mousedownFn);
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            Control.w_Event = (event) => {
                if (event.wEventName === "click" && !Control.hasAttribute("blocking")) {
                    Control.wDelete();
                }
            }

            function mousedownFn(event) {
                const TargetElement = event.target;
                if (Control.hasAttribute("blocking")) {
                    if (TargetElement === Control) {
                        Control.wDelete();
                        MainWindow.removeEventListener("mousedown", mousedownFn);
                    }
                } else {
                    if (!Control.contains(TargetElement)) {
                        Control.wDelete();
                        MainWindow.removeEventListener("mousedown", mousedownFn);
                    }
                }
            }
            MainWindow.addEventListener("mousedown", mousedownFn);

            function clickFn(event) {
                const TargetElement = event.target;
                const element = getAppointParent(TargetElement, (e) => { return e.classList.contains("w-item") && e.parentNode === content });
                Control.wEvent_Select(element);
            }
            content.addEventListener("click", clickFn);
        }

        constructor({
            render = false,
            EventName = generateUniqueId(),
            x = 0,
            y = 0,
            items = null,
            isBlocking = false,
            isSunNode = false,
            container = MainWindow
        }) {
            if (render) return;
            UniquenessElement($("." + EventName));
            this.Element = createElement({
                classList: ["w-context-menu", EventName],
                child: createElement({ classList: ["w-content"] }),
                callback: (element) => { this.init(element) }
            });
            this.Element.EventName = EventName;
            if (isSunNode) {
                this.Element.setAttribute("sunnode", EventName);
            } else {
                UniquenessElement($(".w-context-menu"));
                if (items) this.Element.wAddItems(items);
                container.appendChild(this.Element);
                this.Element.wSetBlocking(isBlocking);
                this.Element.wSetXY(x, y);
            }
            return this.Element;
        }
    }

    class w_drawer_widget {
        init(Control) {
            if (Control === null) { return }

            const content = Control.$(".w-content")[0];

            Control.wSetContent = (e) => {
                if (_WebUtilPro_isString(e)) {
                    content.innerText = e;
                } else if (_WebUtilPro_isHTMLElement(e)) {
                    content.appendChild(e);
                }
            }
            Control.wSetDirection = (direction) => {
                switch (direction) {
                    case _WebUtilPro_direction.Top:
                        { Control.setAttribute("WDirection", "top") }
                        break;
                    case _WebUtilPro_direction.Bottom:
                        { Control.setAttribute("WDirection", "bottom") }
                        break;
                    case _WebUtilPro_direction.Left:
                        { Control.setAttribute("WDirection", "left") }
                        break;
                    case _WebUtilPro_direction.Right:
                        { Control.setAttribute("WDirection", "right") }
                        break;
                    default:
                        Control.wSetDirection(_WebUtilPro_direction.Top);
                        break;
                }
            }
            Control.wSetBlocking = (is) => { is ? Control.setAttribute("blocking", "") : Control.removeAttribute("blocking") }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            Control.w_Event = (event) => {
                if (event.wEventName === "click" && !Control.hasAttribute("blocking")) {
                    Control.remove();
                }
            }
        }

        constructor({
            EventName = generateUniqueId(),
            direction = _WebUtilPro_direction.Bottom,
            content = null,
            isBlocking = false,
            container = MainWindow
        }) {
            UniquenessElement($("." + EventName));
            const fragment = document.createDocumentFragment();
            const drawerContainer = document.createElement("div");
            drawerContainer.className = "w-drawer-widget " + EventName;
            drawerContainer.EventName = EventName;
            const contentElement = document.createElement("div");
            contentElement.className = "w-content";

            drawerContainer.appendChild(contentElement);

            this.init(drawerContainer);
            { // init
                drawerContainer.wSetBlocking(isBlocking);
                drawerContainer.wSetContent(content);
                drawerContainer.wSetDirection(direction);
            }

            fragment.appendChild(drawerContainer);
            container.appendChild(fragment);
            this.Element = drawerContainer;
            return drawerContainer;
        }
    }

    class w_table {
        init(Control) {
            if (Control === null) { return }
            const Head = Control.$(">.w-head")[0];
            const Content = Control.$(">.w-content")[0];
            const title = Head.$(">.w-title")[0];

            const MaxColumn = 18278;
            const MaxRow = 1000000;

            Control.wCurrentClickCell = null;
            Control.wCurrentIndexChar = null;
            Control.wReadOnly = false;
            Control.wCurrentSelect = null;
            Control.wTableChange = () => { };
            Control.wClickCell = () => { };

            function GetNumberColumn(num) {
                if (num > MaxColumn) return "ZZZ";
                let result = '';
                while (num > 0) {
                    let remainder = (num - 1) % 26;
                    result = String.fromCharCode(65 + remainder) + result;
                    num = Math.floor((num - 1) / 26);
                }
                return result;
            }
            function GetColumnToNumber(char) {
                let result = 0;
                for (let i = 0; i < char.length; i++) {
                    result = result * 26 + (char.charCodeAt(i) - 64);
                }
                return result;
            }
            function ClearAllSelect() {
                Control.wCurrentSelect = null;
                forEnd(Content.$(">.w-row"), (element) => {
                    forEnd(element.$(`[select]`), (e) => {
                        e.removeAttribute("select");
                    });
                });
            }
            function SelectAllCell() {
                forEnd(Content.$(">.w-row"), (element) => {
                    forEnd(element.$(`>[w-column-index]`), (e) => {
                        e.setAttribute("select", "");
                    });
                });
            }
            function GetSelect() {
                return Content.$("[select]");
            }
            function GetRowNumber() {
                return Content.$(">.w-row").length;
            }
            function GetColumnNumber() {
                const length = title.$("th").length - 1;
                if (!length || length <= 0) return 0;
                return length;
            }
            function _SelectColumnCell(columnChar, rowStart, rowEnd, fn = () => { }) {
                Control.wCurrentSelect = columnChar;
                forEnd(Content.$(">.w-row"), (element) => {
                    const e = element.$(`[w-column-index="${columnChar}"]`)[0];
                    const rowIndex = parseInt(element.$(`.w-row-index`)[0].innerText);
                    if (rowIndex >= rowStart && rowIndex <= rowEnd) {
                        fn(e);
                    }
                });
            }
            function SelectColumnCell(columnChar, rowStart, rowEnd) {
                _SelectColumnCell(columnChar.toUpperCase(), rowStart, rowEnd, (e) => {
                    e.setAttribute("select", "");
                });
            }
            function _SelectRowCell(row, columnStart, columnEnd, fn = () => { }) {
                if (_WebUtilPro_isNumber(row)) {
                    Control.wCurrentSelect = row;
                    forEnd(Content.$(`>[row=${row}]`)[0].$(">[w-column-index]"), (element) => {
                        const columnIndex = GetColumnToNumber(element.getAttribute("w-column-index"));
                        if (columnIndex >= columnStart &&
                            columnIndex <= columnEnd) {
                            fn(element);
                        }
                    });
                } else {
                    Control.wCurrentSelect = parseInt(row.getAttribute("row"));
                    forEnd(row.$(">[w-column-index]"), (element) => {
                        const columnIndex = GetColumnToNumber(element.getAttribute("w-column-index"));
                        if (columnIndex >= columnStart &&
                            columnIndex <= columnEnd) {
                            fn(element);
                        }
                    });
                }
            }
            function SelectRowCell(row, columnStart, columnEnd) {
                _SelectRowCell(row, columnStart, columnEnd, (e) => {
                    e.setAttribute("select", "");
                });
            }
            function RefreshIndexTitle() {
                forEnd(title.$(">.w-column-index"), (e, i) => {
                    e.$("span")[0].innerText = GetNumberColumn(i + 1);
                });
            }
            function RefreshIndexContent() {
                let num = 1;
                forEnd(Content.$(">.w-row"), (row) => {
                    row.setAttribute("row", num);
                    row.$(">.w-row-index")[0].$("span")[0].innerText = num;
                    num++;
                    forEnd(row.$(">[w-column-index]"), (e, i) => {
                        e.setAttribute("w-column-index", GetNumberColumn(i + 1));
                    });
                });
            }
            function _CreateRow() {
                if (GetRowNumber() > MaxRow) return null;
                const tr = document.createElement("tr");
                tr.setAttribute("row", "");
                tr.className = "w-row";
                {
                    const td = document.createElement("td");
                    const span = document.createElement("span");
                    span.innerText = GetRowNumber();
                    td.className = "w-row-index";
                    td.appendChild(span);
                    tr.appendChild(td);
                }
                for (let i = 1; i < GetColumnNumber() + 1; i++) {
                    const td = document.createElement("td");
                    td.setAttribute("w-column-index", GetNumberColumn(i));
                    tr.appendChild(td);
                }
                return tr;
            }
            function AddRow() {
                Content.appendChild(_CreateRow());
                RefreshIndexContent();
                Control.wTableChange("AddRow");
            }
            function AddColumn() {
                InsertionColumn(GetNumberColumn(GetColumnNumber()), true);
                Control.wTableChange("AddColumn");
            }
            function InsertionRow(index, is = false) {
                forEnd(Content.$(">.w-row"), (element) => {
                    const row = _CreateRow();
                    Content.appendChild(row);
                    Content.insertBefore(row, element);
                    if (is) Content.insertBefore(element, row);
                    return true;
                }, index);
                if (GetRowNumber() <= 0) AddRow();
                RefreshIndexContent();
                Control.wTableChange("InsertionRow", index);
            }
            function InsertionColumn(char, is = false) {
                if (GetColumnNumber() > MaxColumn) return null;
                const th = document.createElement("th");
                const span = document.createElement("span");
                th.appendChild(span);
                th.className = "w-column-index";
                title.appendChild(th);
                RefreshIndexTitle();
                forEnd(Content.$(">.w-row"), (row) => {
                    const old = row.$(`[w-column-index="${char}"]`)[0];
                    const newCell = document.createElement("td");
                    newCell.setAttribute("w-column-index", "");
                    row.appendChild(newCell);
                    if (row.$("td").length === 2) return;
                    row.insertBefore(newCell, old);
                    if (is) row.insertBefore(old, newCell);
                    return "continue";
                });
                RefreshIndexContent();
                Control.wTableChange("InsertionColumn", char);
            }
            function DeleteRow(index) {
                Content.$(`>[row=${index}]`)[0].remove();
                RefreshIndexContent();
                Control.wTableChange("DeleteRow", index);
            }
            function DeleteColumn(char) {
                _SelectColumnCell(char, 1, GetRowNumber(), (e) => { e.remove() });
                const th = title.$(">.w-column-index")[0];
                if (th) th.remove();
                RefreshIndexTitle();
                RefreshIndexContent();
                Control.wTableChange("DeleteColumn", char);
            }
            function ClearAllContenteditable() {
                forEnd(Content.$(">.w-row"), (element) => {
                    forEnd(element.$(`[contenteditable]`), (e) => {
                        e.removeAttribute("contenteditable");
                    });
                });
            }

            Control.wGetNumberColumn = (num) => { return GetNumberColumn(num) }
            Control.wGetColumnToNumber = (char) => { return GetColumnToNumber(char) }
            Control.wDeleteColumn = (char) => { DeleteColumn(char) }
            Control.wDeleteRow = (index) => { DeleteRow(index) }
            Control.wInsertionColumn = (index, is) => { InsertionColumn(index, is) }
            Control.wInsertionRow = (index, is) => { InsertionRow(index, is) }
            Control.wAddColumn = () => { AddColumn() }
            Control.wAddRow = () => { AddRow() }
            Control.wGetSelect = () => { return GetSelect() }
            Control.wSelectRowCell = (row, columnStart, columnEnd) => { SelectRowCell(row, columnStart, columnEnd) }
            Control.wSelectColumnCell = (columnChar, rowStart, rowEnd) => { SelectColumnCell(columnChar, rowStart, rowEnd) }
            Control.wGetColumnNumber = () => { return GetColumnNumber() }
            Control.wGetRowNumber = () => { return GetRowNumber() }
            Control.wSelectAllCell = () => { SelectAllCell() }
            Control.wSetRowNumber = (num) => {
                const rowNum = GetRowNumber();
                if (num < rowNum) {
                    const length = rowNum - num;
                    for (let index = 0; index < length; index++) DeleteRow(1);
                } else if (num > rowNum) for (let index = rowNum; index < num; index++) AddRow();
            }
            Control.wSetColumnNumber = (num) => {
                const ColumnNum = GetColumnNumber();
                if (num < ColumnNum) {
                    const length = ColumnNum - num;
                    for (let index = 0; index < length; index++) DeleteColumn('A');
                } else if (num > ColumnNum) for (let index = ColumnNum; index < num; index++) AddColumn();
            }
            Control.wSetRowData = (index, data) => {
                if (!data) return;
                forEnd(Content.$(`>[row=${index + 1}]`)[0].$(">[w-column-index]"), (e, i) => {
                    if (data[i]) {
                        e.innerText = data[i][0];
                        let s = data[i][1];
                        if (s !== "#") e.setAttribute("style", s);
                    }
                });
            }
            // const json = {
            //     ColumnNumber: 0,
            //     RowNumber: 0,
            //     rows: [
            //         [["213","color:#fff"],["213","color:#fff"],["213","color:#fff"]],
            //         [["213","color:#fff"],["213","color:#fff"],["213","color:#fff"]]
            //     ]
            // }
            Control.wImportData = (jsonData) => {
                Control.wSetColumnNumber(0);
                Control.wSetRowNumber(0);
                Control.wSetColumnNumber(jsonData.ColumnNumber);
                Control.wSetRowNumber(jsonData.RowNumber);
                for (let index = 0; index < GetRowNumber(); index++) Control.wSetRowData(index, jsonData.rows[index]);
            }
            Control.wOutData = () => {
                const json = {
                    ColumnNumber: GetColumnNumber(),
                    RowNumber: GetRowNumber(),
                    rows: []
                }
                forEnd(Content.$(`>[row]`), (row) => {
                    const arr = [];
                    forEnd(row.$(`>[w-column-index]`), (e) => {
                        const cell = [];
                        cell.push(e.innerText);
                        const stylev = e.getAttribute("style") || "#";
                        cell.push(stylev);
                        arr.push(cell);
                    });
                    json.rows.push(arr);
                });
                return json;
            }
            Control.wClearAllSelect = () => { ClearAllSelect() }
            Control.wClearSelectCellData = () => { forEnd(GetSelect(), (e) => { e.innerHTML = null }) }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            title.wAddSoleEventListener("mousedown", (event) => {
                const TargetElement = event.target;
                let CurrentElement = getAppointParent(TargetElement, (e) => { return e.parentNode === title });

                if (CurrentElement.classList.contains("w-select")) {
                    SelectAllCell();
                } else if (CurrentElement.classList.contains("w-column-index")) {
                    Control.wCurrentIndexChar = CurrentElement.innerText;
                    ClearAllSelect();
                    SelectColumnCell(Control.wCurrentIndexChar, 1, GetRowNumber());
                }
            });
            Content.wAddSoleEventListener("mousedown", (event) => {
                const TargetElement = event.target;
                if (TargetElement === Content) { return }
                let CurrentElement = getAppointParent(TargetElement, (e) => { return e.parentNode.tagName === "TR" });

                ClearAllSelect();
                ClearAllContenteditable();
                if (!CurrentElement.classList.contains("w-row-index")) {
                    forEnd(Content.$("[current]"), (e) => { e.removeAttribute("current") });
                }

                if (Control.wCurrentClickCell === CurrentElement) {
                    if (!Control.wReadOnly &&
                        !CurrentElement.hasAttribute("read") &&
                        !CurrentElement.classList.contains("w-row-index")) {
                        CurrentElement.setAttribute("contenteditable", "");
                        CurrentElement.setAttribute("current", "");
                    }
                } else if (event.button === 0 && !CurrentElement.classList.contains("w-row-index")) {
                    Control.wCurrentClickCell = CurrentElement;
                    CurrentElement.setAttribute("current", "");
                    Control.wClickCell(CurrentElement, parseInt(CurrentElement.parentNode.getAttribute("row")), CurrentElement.getAttribute("w-column-index"));
                }

                if (CurrentElement.classList.contains("w-row-index")) {
                    SelectRowCell(CurrentElement.parentNode, 1, GetColumnNumber());
                }
            });
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_scroll_bar {
        init(Control) {
            if (Control === null) { return }
            const bar = Control.$(".w-bar")[0];

            Control.wValue = 0;

            let Hlimit = Control.offsetWidth - bar.offsetWidth;
            let Vlimit = Control.offsetHeight - bar.offsetHeight;

            function TransmitValue(value) {
                Control.wValue = value;
            }
            function Init() {
                if (Control.hasAttribute("horizontal")) {
                    new addDraggable({
                        element: bar,
                        fn: (s, x, y) => { TransmitValue(x + bar.offsetWidth); return !Control.hasAttribute("disabled") },
                        limit: {
                            top: 0,
                            bottom: 0,
                            left: 0,

                            right: Hlimit
                        }
                    });
                } else {
                    new addDraggable({
                        element: bar,
                        fn: (s, x, y) => { TransmitValue(y + bar.offsetHeight); return !Control.hasAttribute("disabled") },
                        limit: {
                            left: 0,
                            right: 0,
                            top: 0,

                            bottom: Vlimit
                        }
                    });
                }
                SetValue(Control.wValue);
            }
            function SetValue(value) {
                if (value < 0) return false;
                if (Control.hasAttribute("horizontal") && value <= Control.offsetWidth) {
                    bar.style.transform = `translate3d(${value}px, 0, 0)`;
                    if (value > Control.offsetWidth - bar.offsetWidth) bar.style.transform = `translate3d(${value - bar.offsetWidth}px,0,0)`;
                } else if (!Control.hasAttribute("horizontal") && value <= Control.offsetHeight) {
                    bar.style.transform = `translate3d(0, ${value}px, 0)`;
                    if (value > Control.offsetHeight - bar.offsetHeight) bar.style.transform = `translate3d(0,${value - bar.offsetHeight}px,0)`;
                }
            }

            Control.wSetBarVisibility = (is) => { bar.setVisibility(is) }
            Control.wSetDisabled = (is) => { is ? Control.setAttribute("disabled", "") : Control.removeAttribute("disabled") }
            Control.wSetHorizontal = (is) => { is ? Control.setAttribute("horizontal", "") : Control.removeAttribute("horizontal") }
            Control.wSetValue = (value) => { SetValue(value) }
            Control.wSetBarValue = (value) => {
                if (Control.hasAttribute("horizontal"))
                    bar.style.width = `${value}%`;
                else
                    bar.style.height = `${value}%`;
            }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            Control.w_Event = (event) => {
                if (Control.hasAttribute("disabled")) return;
                if (event.wEventName === "mousedown") if (Control.hasAttribute("horizontal")) {
                    const value = event.layerX;
                    SetValue(value - bar.offsetWidth / 2);
                    if (value > Control.offsetWidth - bar.offsetWidth) SetValue(Control.offsetWidth);
                    else if (value < bar.offsetWidth) SetValue(0);
                } else {
                    const value = event.layerY;
                    SetValue(value - bar.offsetHeight / 2);
                    if (value > Control.offsetHeight - bar.offsetHeight) SetValue(Control.offsetHeight);
                    else if (value < bar.offsetHeight) SetValue(0);
                }
            }

            Init();
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_sash_widget {
        init(Control) {
            if (Control === null) { return }
            Control.innerHTML = "|";

            let v1, v2;
            let isDragging = false;
            let w = 0, h = 0;
            let currentPointer;

            function RefreshV() {
                if (Control.hasAttribute("w-v1") && Control.hasAttribute("w-v2")) {
                    v1 = $(`.${Control.getAttribute("w-v1")}`)[0];
                    v2 = $(`.${Control.getAttribute("w-v2")}`)[0];
                }
            }

            Control.wSetAttach = (v1, v2) => {
                Control.setAttribute("w-v1", v1);
                Control.setAttribute("w-v2", v2);
                RefreshV();
            }
            Control.wEvent_Move = (m, v1, v2) => { }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            function moveV(event) {
                const TargetElement = event.target;
                if (TargetElement !== Control && TargetElement.tagName.toLowerCase() === "iframe") {
                    release(event);
                    return;
                }
                if (event.clientX <= 1 || event.clientX >= MainWindow.offsetWidth - 5) return;
                const delta = event.clientX - currentPointer;
                v1.style.width = `${w + delta}px`;
                Control.wEvent_Move("vertical", v1.style.width, v2.style.width, [v1, v2], event);
            }
            function moveH(event) {
                const TargetElement = event.target;
                if (TargetElement !== Control && TargetElement.tagName.toLowerCase() === "iframe") {
                    release(event);
                    return;
                }
                if (event.clientY <= 1 || event.clientY >= MainWindow.offsetHeight - 5) return;
                const delta = event.clientY - currentPointer;
                v1.style.height = `${h + delta}px`;
                Control.wEvent_Move("horizontal", v1.style.height, v2.style.height, [v1, v2], event);
            }
            function release(event) {
                isDragging = false;
                w = 0; h = 0;
                document.removeEventListener("mouseup", release);
                document.removeEventListener("mousemove", moveV);
                document.removeEventListener("mousemove", moveH);
            }
            Control.addEventListener("mousedown", (event) => {
                isDragging = true;
                if (isDragging) {
                    if (Control.hasAttribute("vertical")) {
                        currentPointer = event.clientX;
                        w = parseInt(v1.style.width.slice(0, -2)) || v1.offsetWidth;
                        document.addEventListener("mousemove", moveV);
                    } else if (Control.hasAttribute("horizontal")) {
                        currentPointer = event.clientY;
                        h = parseInt(v1.style.height.slice(0, -2)) || v1.offsetHeight;
                        document.addEventListener("mousemove", moveH);
                    }
                }
                document.addEventListener("mouseup", release);
            });

            RefreshV();
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_tree_widget {
        init(Control) {
            if (Control === null) { return }

            function CreateNode(titleText, i) {
                const div = document.createElement("div");
                div.className = "w-node";
                div.setAttribute("data-id", i);

                const title = document.createElement("div");
                title.className = "w-title";

                const span1 = document.createElement("span");
                span1.className = "w-codicon";
                span1.innerHTML = "&#xe315;";

                const span2 = document.createElement("span");
                span2.setAttribute("draggable", "true");
                span2.className = "w-text";
                span2.innerHTML = titleText;

                title.appendChild(span1);
                title.appendChild(span2);

                div.appendChild(title);

                const content = document.createElement("div");
                content.className = "w-content";

                div.addEventListener("drop", ondrop);
                div.addEventListener("dragover", ondragover);
                div.appendChild(content);
                return div;
            }

            function CreateKey(content, i) {
                const element = createElement({
                    classList: ["w-key"],
                    attribute: [["data-id", i], ["draggable", "true"]],
                    html: content
                });
                return element;
            }

            function CheckWhetherNodeHasContent() {
                forEnd(Control.$(".w-node"), (node) => {
                    if (node.$(".w-content")[0].$(">*").length <= 0) {
                        node.removeAttribute("have");
                    } else {
                        node.setAttribute("have", "");
                    }
                });
            }

            function ElementIsNodeOrKey(element) {
                if (element.classList.contains("w-key")) {
                    return false;
                }

                let parentElement = null;

                if (element.classList.contains("w-node")) {
                    parentElement = element;
                } else if (element.classList.contains("w-text") || element.classList.contains("w-codicon")) {
                    parentElement = element.parentNode.parentNode;
                } else if (element.classList.contains("w-title") || element.classList.contains("w-content")) {
                    parentElement = element.parentNode;
                }

                return parentElement;
            }

            function Refresh(data, node, index = 0) {
                if (data === null) return;
                if (node.$ && node.$(".w-content")) node = node.$(".w-content")[0];
                forEnd(data, (e, i) => {
                    const q = `${index}-${i}`;
                    if (_WebUtilPro_isString(e)) {
                        node.appendChild(CreateKey(e, q));
                    } else if (_WebUtilPro_isArray(e)) {
                        let ind = index;
                        ind++;
                        const n = CreateNode(e[0], q);
                        node.appendChild(n);
                        if (_WebUtilPro_isArray(e[1])) return Refresh(e[1], n, ind);
                    } else {
                        node.appendChild(CreateKey(`${e}`, q));
                    }
                });
            }

            function RefreshIndex(node, index = 0) {
                if (node === null) return;
                forEnd(node.$(">*"), (e, i) => {
                    const q = `${index}-${i}`;
                    if (e.classList.contains("w-key")) {
                        e.setAttribute("data-id", q);
                    } else if (e.classList.contains("w-node")) {
                        e.setAttribute("data-id", q);
                        let ind = index;
                        ind++;
                        return RefreshIndex(e.$(">.w-content")[0], ind);
                    }
                });
            }

            function Item_edit(element) {
                if (element.classList.contains("w-text") || element.classList.contains("w-key")) {
                    Control.wRefreshIndex();
                    let Change_timeid;
                    if (element.classList.contains("w-text")) {
                        element.oninput = (event) => {
                            UniquenessElement(element.$("br"));
                            clearTimeout(Change_timeid);
                            Change_timeid = setTimeout(() => {
                                if (/[?\/\\<>\n*&:'"|]/g.test(element.textContent)) {
                                    element.textContent = element.textContent.replace(/[?\/\\<>\n*&:'"|]/g, "");
                                }
                            }, 100);
                        }
                    } else {
                        element.oninput = (event) => {
                            UniquenessElement(element.$("br"));
                            clearTimeout(Change_timeid);
                            Change_timeid = setTimeout(() => {
                                if (/[?\/\\<>\n*&:'"|]/g.test(element.textContent)) {
                                    element.textContent = element.textContent.replace(/[?\/\\<>\n*&:'"|]/g, "");
                                }
                            }, 100);
                        }
                    }
                    element.setAttribute("contenteditable", "true");
                    element.focus();
                    Control.wEvent_Change("EditStart", element);
                    element.removeAttribute("draggable");
                    element.onblur = () => {
                        element.oninput = null;
                        if (element.textContent.trim() === "") {
                            element.textContent = "non-null-" + generateUniqueId(8);
                        }
                        element.setAttribute("draggable", "true");
                        element.removeAttribute("contenteditable");
                        Control.wEvent_Change("EditEnd", element);
                        element.onblur = null;
                    }
                    element.onkeyup = (event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            element.blur();
                            element.onkeyup = null;
                        }
                    };
                }
            }

            function Item_delete(element) {
                if (element.classList.contains("w-text")) {
                    Control.wEvent_Change("DeleteNode", element.parentNode.parentNode);
                    element.parentNode.parentNode.remove();
                } else if (element.classList.contains("w-key")) {
                    Control.wEvent_Change("DeleteKey", element);
                    element.remove();
                }
                if (Control.$("*").length <= 0) {
                    Control.wEvent_NullTree();
                }
                Control.wRefreshIndex();
            }

            function Item_createKey(element, text = "新 键") {
                const ise = ElementIsNodeOrKey(element); ise;
                const e = CreateKey(text, "unknown");
                if (ise) {
                    ise.$(".w-content")[0].appendChild(e);
                } else if (element.parentNode === Control || element === Control) {
                    Control.appendChild(e);
                }
                Control.wRefreshIndex();
                Control.wEvent_Change("CreateKey", e);
            }

            function Item_createNode(element, text = "新 节点") {
                const ise = ElementIsNodeOrKey(element);
                const e = CreateNode(text, "unknown");
                if (ise) {
                    ise.$(".w-content")[0].appendChild(e);
                } else if (element.parentNode === Control || element === Control) {
                    Control.appendChild(e);
                }
                Control.wRefreshIndex();
                Control.wEvent_Change("CreateNode", e);
            }

            function GetItemPath(item) {
                const arr = [];
                function g(item) {
                    if (item.parentNode === Control) {
                        if (item.classList.contains("w-key")) {
                            arr.push(item.textContent);
                        } else if (item.classList.contains("w-text")) {
                            arr.push(item.textContent);
                        } else if (item.classList.contains("w-node")) {
                            arr.push(item.$(".w-title")[0].$(".w-text")[0].textContent);
                        }
                        return;
                    } else {
                        if (item.classList.contains("w-key")) {
                            arr.push(item.textContent);
                            return g(item.parentNode.parentNode.$(".w-title")[0].$(".w-text")[0]);
                        } else if (item.classList.contains("w-text")) {
                            arr.push(item.textContent);
                            if (item.parentNode.parentNode.parentNode === Control) {
                                return;
                            } else {
                                return g(item.parentNode.parentNode.parentNode.parentNode.parentNode.$(".w-title")[0].$(".w-text")[0]);
                            }
                        } else if (item.classList.contains("w-node")) {
                            return g(item.$(".w-title")[0].$(".w-text")[0]);
                        }
                    }
                } g(item);
                return arr.reverse().join('>');
            }

            function GetItemIndexPath(item) {
                const arr = [];
                function g(item) {
                    if (item.parentNode === Control) {
                        if (item.classList.contains("w-key")) {
                            arr.push(item.getAttribute("data-id").split('-')[1]);
                        } else if (item.classList.contains("w-text")) {
                            arr.push(item.parentNode.parentNode.getAttribute("data-id").split('-')[1]);
                        } else if (item.classList.contains("w-node")) {
                            arr.push(item.getAttribute("data-id").split('-')[1]);
                        }
                        return;
                    } else {
                        if (item.classList.contains("w-key")) {
                            arr.push(item.getAttribute("data-id").split('-')[1]);
                            return g(item.parentNode.parentNode.$(".w-title")[0].$(".w-text")[0]);
                        } else if (item.classList.contains("w-text")) {
                            arr.push(item.parentNode.parentNode.getAttribute("data-id").split('-')[1]);
                            if (item.parentNode.parentNode.parentNode === Control) {
                                return;
                            } else {
                                return g(item.parentNode.parentNode.parentNode.parentNode.parentNode.$(".w-title")[0].$(".w-text")[0]);
                            }
                        } else if (item.classList.contains("w-node")) {
                            return g(item.$(".w-title")[0].$(".w-text")[0]);
                        }
                    }
                } g(item);
                return arr.reverse().join('>');
            }

            function Out(data, arr) {
                if (data === null) return;
                forEnd(data, (e) => {
                    if (e.classList.contains("w-key")) {
                        arr.push(e.textContent);
                    } else {
                        const a = [];
                        arr.push([e.$(".w-title")[0].$(".w-text")[0].textContent, a]);
                        Out(e.$(".w-content")[0].$(">*"), a);
                    }
                });
            }

            function ondrop(event) {
                if (!Control.contains(DragTargetElement)) return;
                event.preventDefault();
                event.stopPropagation();
                const TargetElement = event.target;
                if (Control.wEvent_Change("DragBeEnd", DragTargetElement, TargetElement) === false) return;
                if (DragTargetElement && DragTargetElement !== TargetElement) {
                    // 元素移动到 tree
                    if ((TargetElement.parentNode === Control || TargetElement === Control) &&
                        !TargetElement.classList.contains("w-node")) {
                        // tree 下元素移动
                        if (DragTargetElement.parentNode === Control) {
                            if (DragTargetElement.classList.contains("w-key")) {
                                Control.appendChild(DragTargetElement);
                            } else if (DragTargetElement.classList.contains("w-node")) {
                                Control.appendChild(DragTargetElement);
                            }
                        } else {
                            if (DragTargetElement.classList.contains("w-key")) {
                                Control.appendChild(DragTargetElement);
                            } else if (DragTargetElement.classList.contains("w-node")) {
                                Control.appendChild(DragTargetElement);
                            }
                        }
                        Control.wRefreshIndex();
                    } else {
                        let n = null;
                        if (TargetElement.classList.contains("w-node")) {
                            n = TargetElement;
                        } else if (TargetElement.classList.contains("w-codicon") ||
                            TargetElement.classList.contains("w-text") ||
                            TargetElement.classList.contains("w-key")) {
                            n = TargetElement.parentNode.parentNode;
                        } else if (TargetElement.classList.contains("w-content") ||
                            TargetElement.classList.contains("w-title")) {
                            n = TargetElement.parentNode;
                        }
                        n.$(".w-content")[0].appendChild(DragTargetElement);
                        Control.wRefreshIndex();
                    }
                }
                Control.wEvent_Change("DragEnd", DragTargetElement);
            }
            function ondragover(event) {
                if (!Control.contains(DragTargetElement)) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();

                Control.removeAttribute("waver");
                forEnd(Control.$("[waver]"), (e) => { e.removeAttribute("waver") });

                if (this === Control || this.classList.contains("w-node")) { this.setAttribute("waver", "") }
                else if (this.classList.contains("w-text")) { this.parentNode.parentNode.setAttribute("waver", "") }
                else if (this.classList.contains("w-title")) { this.parentNode.setAttribute("waver", "") }
                else if (this.classList.contains("w-key")) { this.parentNode.parentNode.setAttribute("waver", "") }
                else if (this.classList.contains("w-codicon")) { this.parentNode.parentNode.setAttribute("waver", "") }
                else if (this.classList.contains("w-content")) { this.parentNode.setAttribute("waver", "") }

            }

            let DragTargetElement = null;
            let DragElement = null;
            let isShowDrag = false;

            Control.wContextMenuVisibility = true;
            Control.wSelectItem = null;
            // Control.wDuplicateElementOrNot = (is) => { is ? Control.setAttribute("duplicate", "") : Control.removeAttribute("duplicate") }
            Control.wCurrentParent = Control;
            Control.wGetItemPath = (item = Control.wSelectItem) => { return GetItemPath(item) }
            Control.wGetItemIndexPath = (item = Control.wSelectItem) => { return GetItemIndexPath(item) }
            Control.wItem_edit = (element) => { Item_edit(element) }
            Control.wItem_delete = (element) => { Item_delete(element) }
            Control.wItem_createKey = (element = Control.wCurrentParent, text = "新 键") => { Item_createKey(element, text) }
            Control.wItem_createNode = (element = Control.wCurrentParent, text = "新 节点") => { Item_createNode(element, text) }
            Control.wEvent_Click = (e, is) => { }
            Control.wEvent_Change = (e) => { }
            Control.wEvent_NullTree = () => { }
            Control.wElementIsNodeOrKey = (element) => { return ElementIsNodeOrKey(element) }
            Control.wRefreshIndex = () => {
                RefreshIndex(Control);
                CheckWhetherNodeHasContent();
            }
            Control.wOutData = () => {
                const arr = [];
                Out(Control.$(">*"), arr);
                return arr;
            }
            Control.wSetData = (arr) => {
                Control.innerHTML = null;
                const fragment = document.createDocumentFragment();
                Refresh(arr, fragment);
                Control.appendChild(fragment);
                CheckWhetherNodeHasContent();
            }
            Control.wFoldAllGroups = () => {
                forEnd(Control.$("[open]"), (e) => { e.$(">.w-title")[0].click() });
            }
            Control.wContextMenu = (event, x, y, type) => {
                const TargetElement = event.target;

                let arr = [
                    {
                        text: "添加节点",
                        fontImg: "\ue1af"
                    },
                    {
                        text: "添加键",
                        fontImg: "\ue3ba"
                    },
                    {
                        text: "编辑",
                        fontImg: "\ue22b"
                    },
                    null,
                    {
                        text: "删除",
                        fontImg: "\ue5cd"
                    }
                ]
                if (type === "key") {
                    arr = [
                        {
                            text: "编辑",
                            fontImg: "\ue22b"
                        },
                        null,
                        {
                            text: "删除",
                            fontImg: "\ue5cd"
                        }
                    ]
                } else if (type === "tree") {
                    arr = [
                        {
                            text: "添加节点",
                            fontImg: "\ue1af"
                        },
                        {
                            text: "添加键",
                            fontImg: "\ue3ba"
                        }
                    ]
                }
                const contextMenu = new w_context_menu({
                    x: x,
                    y: y,
                    isBlocking: true,
                    items: arr
                });
                contextMenu.wEvent_Select = (element) => {
                    if (element.$(".text")[0])
                        switch (element.$(".text")[0].innerText) {
                            case "编辑": Item_edit(TargetElement); break;
                            case "删除": Item_delete(TargetElement); break;
                            case "添加节点": Item_createNode(TargetElement); break;
                            case "添加键": Item_createKey(TargetElement); break;
                        }
                    contextMenu.wDelete();
                }
            }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            Control.addEventListener("click", (event) => {
                const TargetElement = event.target;
                if (TargetElement.classList.contains("w-codicon")) {
                    TargetElement.parentNode.$(".w-text")[0].click();
                    return;
                }
                if (TargetElement.classList.contains("w-text") ||
                    TargetElement.classList.contains("w-key")) {
                    forEnd(Control.$("[select]"), (e) => { e.removeAttribute("select") });
                    TargetElement.setAttribute("select", "");
                    Control.wSelectItem = TargetElement;
                    if (TargetElement.classList.contains("w-text")) {
                        Control.wCurrentParent = TargetElement.parentNode.parentNode;
                        Control.wEvent_Click(TargetElement, true);
                    } else {
                        Control.wCurrentParent = node;
                        Control.wEvent_Click(TargetElement, false)
                    };
                }
                if (TargetElement.hasAttribute("contenteditable")) return;
                const title = TargetElement.classList.contains("w-title") ? TargetElement : TargetElement.parentNode.classList.contains("w-title") ? TargetElement.parentNode : false;
                if (title) {
                    const node = title.parentNode;
                    Control.wCurrentParent = node;
                    if (node.classList.contains("w-node")) {
                        if (node.hasAttribute("open")) {
                            node.removeAttribute("open");
                            title.$(">.w-codicon")[0].textContent = "\ue315";
                        } else if (!node.hasAttribute("open")) {
                            node.setAttribute("open", "");
                            title.$(">.w-codicon")[0].textContent = "\ue313";
                        }
                    }
                }
            });

            Control.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                event.stopPropagation();
                const TargetElement = event.target;

                if (Control.wContextMenuVisibility)
                    if (TargetElement.classList.contains("w-key"))
                        Control.wContextMenu(event, event.clientX, event.clientY, "key");
                    else if (TargetElement === Control)
                        Control.wContextMenu(event, event.clientX, event.clientY, "tree");
                    else
                        Control.wContextMenu(event, event.clientX, event.clientY);
            });

            Control.addEventListener('dragstart', function (event) {
                const TargetElement = event.target;
                if (TargetElement.classList.contains("w-text")) {
                    DragTargetElement = TargetElement.parentNode.parentNode;
                } else {
                    DragTargetElement = TargetElement;
                }
                Control.wEvent_Change("DragStart", DragTargetElement);

                const img = new Image();
                img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E";
                event.dataTransfer.setDragImage(img, 0, 0);
                event.dataTransfer.setData("text/plain", TargetElement.textContent);
                event.dataTransfer.dropEffect = "move";

                if (!isShowDrag) {
                    DragElement = createElement({
                        classList: ["w-tree-widget-drag-element"],
                        html: TargetElement.textContent
                    });
                    MainWindow.appendChild(DragElement);
                    isShowDrag = true;
                }
            });

            Control.addEventListener('drag', function (event) {
                if (isShowDrag) {
                    DragElement.style.transform = `translate3d(${event.clientX + 10}px ,${event.clientY + 10}px,0)`;
                    if (event.clientX === 0 && event.clientY === 0) {
                        DragElement.style.display = 'none';
                    } else {
                        DragElement.style.display = 'flex';
                    }
                }
            });

            Control.addEventListener('dragend', function (event) {
                DragTargetElement = null;
                Control.removeAttribute("waver");
                forEnd(Control.$("[waver]"), (e) => { e.removeAttribute("waver") });
                if (isShowDrag) {
                    MainWindow.removeChild(DragElement);
                    DragElement = null;
                    isShowDrag = false;
                }
            });

            Control.addEventListener("drop", ondrop);
            Control.addEventListener("dragover", ondragover);
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    class w_tab_iframe {
        init(Control) {
            if (Control === null) { return }
            const bar = Control.$(".w-bar")[0];
            const content = Control.$(".w-content")[0];

            let oldSrc = null;
            let currentSrc = null;

            function Select(element) {
                oldSrc = bar.$(">[select]")[0];
                element.setAttribute("select", "");
                Control.wSelectTabIndex = element.getAttribute("w-index");
                currentSrc = element;
                content.src = element.getAttribute("w-src");
                Control.wEvent_Select(element);
            }
            function DeleteTab(element) {
                if (element.parentNode.classList.contains("w-bar")) {
                    Control.wEvent_Remove(element, true);
                    if (element) element.remove();
                } else if (element.parentNode.parentNode.classList.contains("w-bar")) {
                    Control.wEvent_Remove(element.parentNode, false);
                    if (element.parentNode) element.parentNode.remove();
                }
                if (document.contains(oldSrc)) {
                    Select(oldSrc);
                } else if (bar.$(">*").length > 0) {
                    bar.$(">[w-index]")[0].setAttribute("select", "");
                    Select(bar.$(">[w-index]")[0]);
                }
                Sort();
            }
            function Sort() {
                forEnd(bar.$(">.w-tab-title"), (e, i) => {
                    e.setAttribute("w-index", i);
                });
            }
            function InitDelete() {
                forEnd(bar.$(">.w-tab-title"), (e) => {
                    forEnd(e.$(">.w-delete"), (e) => { e.remove() });
                    if (e.hasAttribute("delete")) {
                        e.appendChild(createElement({
                            tagName: "i",
                            classList: ["material-icons", "w-delete"],
                            html: "&#xe5cd;",
                        }));
                    }
                });
            }
            function AddItem(text, src, isDel) {
                const e = createElement({
                    tagName: "span",
                    classList: ["w-tab-title"],
                    attribute: [["w-src", src], ["draggable", "true"]],
                    text: text,
                });
                if (isDel) e.setAttribute("delete", "");
                bar.appendChild(e);
                InitDelete();
                Sort();
                return e;
            }

            function RemoveItem(index) {
                DeleteTab(bar.$(`>[w-index=${index}]`)[0])
            }

            function SetItem(index, src, isDel) {
                const e = bar.$(`>[w-index=${index}]`)[0];
                if (src) {
                    e.setAttribute("w-src", src);
                } else if (isDel) {
                    e.setAttribute("delete", "");
                }
                InitDelete();
            }

            Control.wDefaultSrc = Control.getAttribute("src") || "";
            Control.wAddItem = (text, src = "", isDel = true) => { return AddItem(text, src, isDel) }
            Control.wRemoveItem = (index) => { RemoveItem(index) }
            Control.wSetItem = (index) => { SetItem(index) }
            Control.wEvent_Select = (e) => { }
            Control.wEvent_Remove = (e) => { }
            Control.wInitDelete = () => { InitDelete() }
            Control.wSelect = (index) => { bar.$(`>[w-index=${index}]`)[0].dispatchEvent(_W_Event("mousedown")) }
            Control.wEvent_ControlDelete = () => { }
            Control.wDelete = () => {
                Control.wEvent_ControlDelete();
                Control.remove();
            }

            function mousedownFn(event) {
                const TargetElement = event.target;
                let CurrentElement = getAppointParent(TargetElement, (e) => { return e.parentNode === bar });

                if (CurrentElement && CurrentElement !== null && CurrentElement.classList.contains("w-tab-title")) {
                    if (TargetElement.classList.contains('w-delete') &&
                        TargetElement.parentNode.parentNode === bar ||
                        TargetElement.hasAttribute("disabled")) {
                        return;
                    }
                    forEnd(bar.$(">[select]"), (e) => {
                        e.removeAttribute("select");
                    });
                    Select(CurrentElement);
                }
            }
            function clickFn(event) {
                const TargetElement = event.target;
                let CurrentElement = getAppointParent(TargetElement, (e) => { return e.parentNode === bar });
                if (CurrentElement && CurrentElement !== null && CurrentElement.classList.contains("w-tab-title")) {
                    if (!TargetElement.classList.contains('w-delete') ||
                        TargetElement.parentNode.parentNode !== bar ||
                        TargetElement.parentNode.hasAttribute("disabled")) {
                        return;
                    }
                    DeleteTab(TargetElement);
                }
            }
            bar.wAddsSoleEventListener(["mousedown", "click"], [mousedownFn, clickFn]);

            content.src = Control.wDefaultSrc;
            content.onerror = () => {
                content.src = Control.wDefaultSrc;
            }

            InitDelete();
            Sort();
            if (bar.$(">[select]")[0]) {
                Select(bar.$(">[select]")[0]);
            }
        }

        constructor(element = null) {
            this.Element = element;

            this.init(this.Element);
        }
    }

    function WMessage({
        EventName = generateUniqueId(),
        parent = generateUniqueId(),
        message = "hello",
        time = 2000,
        place = _WebUtilPro_analysisPlace(_WebUtilPro_place.Center.Bottom),
        level = _WebUtilPro_event_level.normal,
        container = MainWindow
    }) {
        UniquenessElement($("." + EventName));
        const parentE = $("." + parent);
        if (parentE.length > 0) {
            parentE[0].innerHTML += `<p class="text">${message}</p>`;
        } else {
            const messageContainer = createElement({
                classList: ["w-message", EventName, parent],
                html: `<p class="text">${message}</p>`,
                attribute: [
                    [level, ""],
                    ["place", place]
                ]
            });
            messageContainer.EventName = EventName;
            setTimeout(() => {
                messageContainer.remove();
            }, time);
            container.appendChild(messageContainer);
        }
    }

    function WTitle() {
        let timeid;
        let ctimeid;
        MainWindow.wAddSoleEventListener("mouseover", (event) => {
            const Element = event.target;
            let text = Element.getAttribute("WTitle");
            if (Element.hasAttribute("WTitle")) {
                clearTimeout(timeid);
                clearInterval(ctimeid);
                timeid = setTimeout(() => {
                    UniquenessElement($(".w-title-hover"));
                    const div = createElement({
                        classList: ["w-title-hover"],
                        html: `<p class="text">${Element.getAttribute("WTitle")}</p>`
                    });
                    if (text.at(0) === '#') {
                        div.setAttribute("const", "");
                        div.innerText = text.substring(1, text.length);
                    }
                    MainWindow.appendChild(div);
                    const xy = RangeCorrection(event.clientX + 5, event.clientY + 5, div);
                    div.style.top = `${xy[0] - 3}px`;
                    div.style.left = `${xy[1] - 3}px`;
                }, 600);
            } else if (Element.className === "w-title-hover" && Element.hasAttribute("const")) {
                return;
            } else {
                clearTimeout(timeid);
                UniquenessElement($(".w-title-hover"));
            }
        });
    }

    function WValueEntry() {
        forEnd($("[w-value-entry]"), (e) => {
            const regex = /{{([^{}]+)}}/g;
            const str = e.innerText;
            e.innerText = str.replace(regex, (match, p1) => {
                return eval(p1)
            });
        });
    }

    const ControlDataList = [
        ["w-animation-widget", w_animation_widget],
        ["w-list-widget", w_list_widget],
        ["w-line-edit", w_line_edit],
        ["w-bool-button", w_bool_button],
        ["w-tree-widget", w_tree_widget],
        ["w-text-edit", w_text_edit],
        ["w-text-read", w_text_read],
        ["w-line-read", w_line_read],
        ["w-switch-button", w_switch_button],
        ["w-progress-bar", w_progress_bar],
        ["w-sash-widget", w_sash_widget],
        ["w-scroll-bar", w_scroll_bar],

        ["w-tab-widget", w_tab_widget],
        ["w-tab-iframe", w_tab_iframe],
        ["w-stacked-widget", w_stacked_widget],
        ["w-table", w_table],

        ["w-combo-box", w_combo_box],
    ];

    function render(path = null, IS_ADD_WINIT = true) {
        if (path !== null) {
            includeCssFiles([
                [path + "/style/button.css", null, _WebUtilPro__STYLE_INIT],
                [path + "/style/container.css", null, _WebUtilPro__STYLE_INIT],
                [path + "/style/display_widget.css", null, _WebUtilPro__STYLE_INIT],
                [path + "/style/input_widget.css", null, _WebUtilPro__STYLE_INIT],
                [path + "/style/layout.css", null, _WebUtilPro__STYLE_INIT],
                [path + "/style/spacer.css", null, _WebUtilPro__STYLE_INIT],
                [path + "/style/widget.css", null, _WebUtilPro__STYLE_INIT],
            ]);
        }
        WTitle();
        WValueEntry();
        forEnd(ControlDataList, (arr) => {
            forEnd($(`.${arr[0]}`), (e) => {
                if (IS_ADD_WINIT) e.setAttribute("winit", "");
                new arr[1](e);
            });
        });
    }

    function resetRender(Element = MainWindow) {
        WValueEntry();
        forEnd(ControlDataList, (arr) => {
            if (!Element.hasAttribute("winit") && Element.classList.contains(arr[0])) {
                new arr[1](Element);
                Element.setAttribute("winit", "");
            }
            forEnd(Element.$(`.${arr[0]}`), (e) => {
                if (!e.hasAttribute("winit")) {
                    new arr[1](e);
                    e.setAttribute("winit", "")
                }
            });
        });
    }

    function IsEmptyInputControl(container, isRemind = true) {
        let is = true;
        function fn(e) {
            if (e.wValue === "") {
                if (isRemind) {
                    const name = e.getAttribute("name");
                    WMessage({
                        parent: `empty-input-group-${container.SoleID}`,
                        EventName: `empty-input-${name}`,
                        message: `${name} 不能为空!`,
                        level: _WebUtilPro_event_level.severe,
                        place: _WebUtilPro_analysisPlace(_WebUtilPro_place.Center.Top)
                    });
                }
                elementAnimation(e, "WebGUIPro-scale-bounce 0.3s ease-in-out");
                is = false;
            }
        }
        if (container.classList.contains("empty-value-error")) fn(container);
        forEnd(container.$(".empty-value-error"), (e) => { fn(e) });
        return is;
    }

    var ControlGeneration = (function () {
        return {
            list_widget: function () {
                return createElement({
                    classList: ["w-list-widget"],
                    callback: (element) => { resetRender(element) }
                });
            },
            sash_widget: function (direction = "vertical") {
                return createElement({
                    classList: ["w-sash-widget"],
                    html: `<div class="w-sash-widget" direction="${direction}"></div>`,
                    callback: (element) => { resetRender(element) }
                });
            },
            tab_widget: function () {
                return createElement({
                    classList: ["w-tab-widget"],
                    html: `<div class="w-bar"></div><div class="w-content"></div><div class="w-tabs"></div>`,
                    callback: (element) => { resetRender(element) }
                });
            },
            stacked_widget: function () {
                return createElement({
                    classList: ["w-stacked-widget"],
                    callback: (element) => { resetRender(element) }
                });
            },
            combo_box: function () {
                return createElement({
                    classList: ["w-combo-box"],
                    html: `<div class="w-content"><div class="w-line-edit"><input type="text"></div><button class="w-bool-button" pattern="text" state="false"><span class="text false material-icons">&#xe313;</span><span class="text true material-icons">&#xe316;</span><img draggable="false" class="img false" src=""><img draggable="false" class="img true" src=""></button></div><div class="w-list" state="hidde"><div class="w-list-widget" WEvent="click"></div></div>`,
                    callback: (element) => { resetRender(element) }
                });
            },
            line_edit: function () {
                return createElement({
                    classList: ["w-line-edit"],
                    html: `<input type="text">`,
                    callback: (element) => { resetRender(element) }
                });
            },
            bool_button: function () {
                return createElement({
                    tagName: "button",
                    classList: ["w-bool-button"],
                    attribute: [["pattern", "text"], ["state", "false"]],
                    html: `<span class="text false material-icons">&#xe313;</span><span class="text true material-icons">&#xe316;</span><img draggable="false" class="img false" src=""><img draggable="false" class="img true" src="">`,
                    callback: (element) => { resetRender(element) }
                });
            },
            animation_widget: function () {
                return createElement({
                    classList: ["w-animation-widget"],
                    attribute: [["WAnimationName", ""], ["WShowTime", "2000"], ["WShowModel", "fullscreen"]],
                    callback: (element) => { resetRender(element) }
                });
            },
            text_edit: function () {
                return createElement({
                    tagName: "textarea",
                    classList: ["w-text-edit"],
                    callback: (element) => { resetRender(element) }
                });
            },
            text_read: function () {
                return createElement({
                    tagName: "textarea",
                    classList: ["w-text-read"],
                    attribute: [["readonly", ""]],
                    callback: (element) => { resetRender(element) }
                });
            },
            line_read: function () {
                return createElement({
                    classList: ["w-line-read"],
                    html: `<input type="text" readonly>`,
                    callback: (element) => { resetRender(element) }
                });
            },
            switch_button: function () {
                return createElement({
                    classList: ["w-switch-button"],
                    html: `<input class="w-checkbox-button" type="checkbox">`,
                    callback: (element) => { resetRender(element) }
                });
            },
            progress_bar: function () {
                return createElement({
                    classList: ["w-progress-bar"],
                    attribute: [["style", "width: 150px;"]],
                    html: `<div class="w-bar"><span class="w-space"></span></div><span class="w-unit"></span><input type="range" />`,
                    callback: (element) => { resetRender(element) }
                });
            },
            scroll_bar: function () {
                return createElement({
                    classList: ["w-scroll-bar"],
                    html: `<div class="w-bar"></div>`,
                    callback: (element) => { resetRender(element) }
                });
            },
            table: function () {
                return createElement({
                    tagName: "table",
                    classList: ["w-table"],
                    html: `<thead class="w-head"><tr class="w-title"><th class="w-select"><span><i class="material-icons">&#xe1c8;</i></span></th></tr></thead><tbody class="w-content"></tbody>`,
                    callback: (element) => { resetRender(element) }
                });
            },
            tab_iframe: function () {
                return createElement({
                    classList: ["w-tab-iframe"],
                    html: `<div class="w-bar"></div><iframe class="w-content" src=""></iframe>`,
                    callback: (element) => { resetRender(element) }
                });
            },
        };
    })();

    return {
        render,
        resetRender,
        WTitle,
        WMessage,

        IsEmptyInputControl,

        _W_Event,
        _Animation_List,
        ControlGeneration,

        w_list_widget,
        w_tab_widget,
        w_stacked_widget,
        w_combo_box,
        w_tree_widget,
        w_line_edit,
        w_bool_button,
        w_animation_widget,
        w_text_edit,
        w_text_read,
        w_line_read,
        w_switch_button,
        w_progress_bar,
        w_dialog,
        w_activity_widget,
        w_context_menu,
        w_drawer_widget,
        w_sash_widget,
        w_tab_iframe,
        // w_scroll_bar,
        w_table
    }
})();
