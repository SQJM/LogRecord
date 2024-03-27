
// 日志变化
function LogChange() {
    const CurrentData = LogRecord_Table.wOutData();
    if (OldLogData !== CurrentData) {
        OldLogData = CurrentData;
        if (Process.length > 20) {
            Process.shift();
        }
        Process.push(OldLogData);
        Process_index = Process.length - 1;
    }
}

// 日志步骤操作
function Log_Step_Operator() {
    if (Process_index > Process.length) {
        Process_index = Process.length - 1;
        return;
    };
    if (Process_index < 0) {
        Process_index = 0;
        return;
    };
    const data = Process[Process_index];
    if (data) {
        TableDataSet(data, Log_data.$(".name")[0].innerText);
    }
}

// 关于 使用服务协议
function About_FN_Use_Service_Agreement() {
    const content = ExternalControl.get(".使用服务协议", 0);
    new w_dialog({
        title: "《使用服务协议》",
        content: content,
        isBlocking: true,
        isDeleteBtn: false,
        btns: [
            ["同意", () => {
                SetConfig("AgreeProtocol", true);
                return false;
            }],
            ["拒绝", () => {
                SetConfig("AgreeProtocol", false);
                window.__CuteFox__.Application.Exit(0);
            }, { border: "solid 1.5px #a0d4e8" }]
        ]
    });
}

// 关于 使用框架协议
function About_FN_Using_framework_protocols() {
    const content = ExternalControl.get(".使用框架协议", 0);
    new w_dialog({
        title: "《使用框架协议》",
        content: content,
        isBlocking: true,
        isDeleteBtn: true
    });
}

// 设置配置
function SetConfig(key, value) {
    if (value === true) {
        ConfigIni.SetKey(key, "true");
    } else if (value === false) {
        ConfigIni.SetKey(key, "false");
    } else
        ConfigIni.SetKey(key, value);
    ConfigIni.Save();
    RefreshSettingsScreen();
}

// 刷新设置界面
function RefreshSettingsScreen() {
    $("#自动保存日志").wSetState(GetConfig("AutoSavedLog"));
    $("#检查应用更新").wSetState(GetConfig("CheckForAppUpdates"));
    $("#右侧显示缩放按钮").wSetState(GetConfig("RightShowScaleButton"));
    if (!GetConfig("RightShowScaleButton")) {
        LogRecord_Log_view_scale.style.display = "none";
    } else {
        LogRecord_Log_view_scale.style.display = "flex";
    }

    $("#开启备份").wSetState(GetConfig("Backups"));
    if (GetConfig("Backups")) {
        $(".backups-time-box")[0].style.display = "flex";
        {
            $(`#backups-time-0`).checked = GetConfig("BackupsTime0");
            $(`#backups-time-1`).checked = GetConfig("BackupsTime1");
            $(`#backups-time-2`).checked = GetConfig("BackupsTime2");
            $(`#backups-time-3`).checked = GetConfig("BackupsTime3");
        }
    } else {
        $(".backups-time-box")[0].style.display = "none";
    }
}

// 获取版本更新
function GetVersionUpdate(is = false) {
    const json = JSON.parse(window.__CuteFox__.HttpUtils.SendGetRequest('https://sqjm.netlify.app/Project/LogRecord/updateMessage.txt'));
    const title = json.title;
    const content = json.content;
    const version = json.version;
    const downloadlink = json.downloadlink;
    if (version === LogRecordVersion && !is) {
        WMessage({ message: "已是最新版", place: "CC", time: 2100, EventName: "update-message-result" });
        return;
    }
    if (version === LogRecordVersion) return;
    if (is && version === GetConfig(BreakVersionUpdate)) return;
    const div = document.createElement("div");
    div.innerHTML = content;
    new w_dialog({
        title: title + ": " + version,
        content: div,
        isBlocking: true,
        isDeleteBtn: true,
        btns: [
            ["跳过此次更新", () => {
                SetConfig("BreakVersionUpdate", version);
                return false;
            }],
            ["前往下载", () => { window.__CuteFox__.ExternalInteraction.GoBrowser(downloadlink) }]
        ]
    });
}

// 获取配置
function GetConfig(key) {
    return ConfigIni.GetKey(key) === "true";
}

function GetConfigStr(key) {
    const str = ConfigIni.GetKey(key);
    if (str !== null) {
        return str
    }
    return "";
}

// 表格数据设置
function TableDataSet(data, nameText) {
    const name = Log_data.$(".name")[0];
    const allsize = Log_data.$(".allsize")[0];
    const allsize_row = allsize.$(".row")[0];
    const allsize_column = allsize.$(".column")[0];
    const nowcell = Log_data.$(".nowcell")[0];
    const nowcell_row = nowcell.$(".row")[0];
    const nowcell_column = nowcell.$(".column")[0];
    const nowcell_column_num = nowcell.$(".column-num")[0];

    LogRecord_Table.wCurrentSelect = null;
    LogRecord_Table.wImportData(data);

    name.innerText = nameText;
    allsize_row.innerText = LogRecord_Table.wGetRowNumber();
    allsize_column.innerText = LogRecord_Table.wGetColumnNumber();
    nowcell_column.innerText = null;
    nowcell_row.innerText = null;
    nowcell_column_num.innerText = null;

    SetConfig("LastOpenLog", nameText);
}

// 使用帮助
function use_help() {
    const content = ExternalControl.get(".use_help_div", 0);
    new w_dialog({
        title: "使用帮助",
        content: content,
        isBlocking: true,
        isDeleteBtn: true
    });
}

// 公式帮助
function fX_help() {
    const content = ExternalControl.get(".fX_help_div", 0);
    new w_drawer_widget({
        direction: _WebUtilPro_direction.Top,
        content: content
    });
}

// 设置保存标志
function set_saved_sign(is, isR = true, isMess = true) {
    const e = $("#log_is_saved");
    if (is) {
        const data = LogRecord_Table.wOutData();
        const file = new window.__CuteFox__.File(LogBasePath + Log_data.$(".name")[0].innerText);
        file.Write(JSON.stringify(data));
        file.Close();
        SetConfig("LastOpenLog", Log_data.$(".name")[0].innerText);
        e.removeAttribute("no");
        if (isMess) WMessage({ message: "保存成功", place: "CB", time: 1500, EventName: "saved-log-ok" });
    } else {
        if (isR) LogChange();
        e.setAttribute("no", "");
        if (GetConfig("AutoSavedLog")) {
            clearTimeout(AutoSavedTimeId);
            AutoSavedTimeId = setTimeout(() => {
                set_saved_sign(true, true, false);
            }, 500);
        }
    }
}

// 读取日志
function read_log(name) {
    const file = new window.__CuteFox__.File(LogBasePath + name, {
        inexistenceIsCreate: false
    });
    const data = file.ReadAll();
    let r = false;
    if (!file.Exists()) {
        file.Close();
        return r;
    }
    file.Close();
    if (data === "") return "{}";
    return JSON.parse(data);
}

function handleImportFile() {
    const name = getNowFormatDate();
    const file = new window.__CuteFox__.File(LogBasePath + name);
    file.Write(DataDispose.handleImportFile());
    file.Close();
    WMessage({ message: "导入成功,日志名: " + name, place: "CC", time: 2800, EventName: "import-log-ok" });
}

// 事件绑定
function event_bind() {
    // 底部界面切换
    (function () {
        const LogRecord_Bottom_Bar_log = LogRecord_Bottom_Bar.$(".log")[0];
        const LogRecord_Bottom_Bar_set = LogRecord_Bottom_Bar.$(".set")[0];
        const LogRecord_Bottom_Bar_about = LogRecord_Bottom_Bar.$(".about")[0];
        // 清除选择标签
        function SelectWidget(e, i) {
            forEnd(LogRecord_Bottom_Bar.$(">[select]"), (e) => { e.removeAttribute("select") });
            e.setAttribute("select", "");
            LogRecord_Center_Content.wSelect(i);
        }
        LogRecord_Bottom_Bar_log.w_Event = (event) => {
            if (event.wEventName === "click") {
                SelectWidget(LogRecord_Bottom_Bar_log, 0);
            }
        }
        LogRecord_Bottom_Bar_set.w_Event = (event) => {
            if (event.wEventName === "click") {
                SelectWidget(LogRecord_Bottom_Bar_set, 1);
            }
        }
        LogRecord_Bottom_Bar_about.w_Event = (event) => {
            if (event.wEventName === "click") {
                SelectWidget(LogRecord_Bottom_Bar_about, 2);
            }
        }
    })();

    // 表格缩放工具
    (function () {
        const hammertime = new Hammer(LogRecord_Table);
        let fs = 16;
        const n = 0.5;
        const LogRecord_Log_view_scale_style = $(".LogRecord_Log_view_scale_style")[0];
        function SetFontSize() { LogRecord_Log_view_scale_style.innerHTML = `.LogRecord_Log_table *{font-size:${fs}px;} .LogRecord_Log_table>.box>.w-table>.w-head>.w-title>.w-select>span>i {font-size:${fs * 1.5}px;}` }
        LogRecord_Log_view_scale.$("i")[0].w_Event = (event) => {
            if (event.wEventName === "click") {
                fs += n;
                if (fs > 60) fs -= n;
                SetFontSize();
            }
        }
        LogRecord_Log_view_scale.$("i")[1].w_Event = (event) => {
            if (event.wEventName === "click") {
                fs -= n;
                if (fs < 8) fs += n;
                SetFontSize();
            }
        }
        LogRecord_Log_view_scale.$("i")[2].w_Event = (event) => {
            if (event.wEventName === "click") {
                fs = 16;
                SetFontSize();
            }
        }
        hammertime.get('pinch').set({
            enable: true,
            threshold: 0.1,
        });
        hammertime.on('pinchout', function (ev) { // 近
            fs += n;
            if (fs > 60) fs -= n;
            SetFontSize();
        });

        hammertime.on('pinchin', function (ev) { // 远
            fs -= n;
            if (fs < 8) fs += n;
            SetFontSize();
        });
    })();

    // 设置 按钮绑定
    (function () {
        $("#自动保存日志").wEvent_Click = (is) => {
            SetConfig("AutoSavedLog", is);
        }
        $("#检查应用更新").wEvent_Click = (is) => {
            SetConfig("CheckForAppUpdates", is);
        }
        $("#右侧显示缩放按钮").wEvent_Click = (is) => {
            SetConfig("RightShowScaleButton", is);
        }

        $("#开启备份").wEvent_Click = (is) => {
            SetConfig("Backups", is);
        }
        $("#backups-time-0").w_Event = (event) => {
            if (event.wEventName === "click") {
                const is = event.target.checked;
                SetConfig("BackupsTime0", is);
            }
        }
        $("#backups-time-1").w_Event = (event) => {
            if (event.wEventName === "click") {
                const is = event.target.checked;
                SetConfig("BackupsTime1", is);
            }
        }
        $("#backups-time-2").w_Event = (event) => {
            if (event.wEventName === "click") {
                const is = event.target.checked;
                SetConfig("BackupsTime2", is);
            }
        }
        $("#backups-time-3").w_Event = (event) => {
            if (event.wEventName === "click") {
                const is = event.target.checked;
                SetConfig("BackupsTime3", is);
            }
        }
    })();

    // 操作 按钮绑定
    (function () {
        $("#使用帮助").w_Event = (event) => {
            if (event.wEventName === "click") {
                use_help();
            }
        }//&#xe801;
        $("#回收站管理").w_Event = (event) => {
            if (event.wEventName === "click") {
                const div = document.createElement("div");
                div.className = "w-list-widget recycle-admin";
                div.style.width = "100%";
                new w_dialog({
                    title: "回收站管理",
                    content: div,
                    isBlocking: true,
                    isDeleteBtn: true,
                    btns: [
                        ["还原", () => {
                            const filePath = RecyclePath + div.wSelectItemText;
                            const file = new window.__CuteFox__.File(filePath, {
                                inexistenceIsCreate: false
                            });
                            if (file.Exists()) {
                                file.Move(LogBasePath);
                                file.Close();
                            }
                            WMessage({ message: "还原成功", place: "CB", time: 2100, EventName: "recycle-file-move-ok" });
                            return false;
                        }],
                        ["清理", () => {
                            const arr = Recycle.GetFileList();
                            forEnd(arr, (e) => {
                                const file = new window.__CuteFox__.File(RecyclePath + e, {
                                    inexistenceIsCreate: false
                                });
                                if (file.Exists()) {
                                    file.Delete();
                                }
                            });
                            WMessage({ message: "清理成功", place: "CB", time: 2100, EventName: "clear-recycle-ok" });
                            return false;
                        }],
                        ["取消", () => { return false; }]
                    ]
                });
                const arr = Recycle.GetFileList();
                forEnd(arr, (e) => {
                    div.wAddItem(e);
                });
                div.wSelect(0);
            }
        }
        $("#管理导出日志").w_Event = (event) => {
            if (event.wEventName === "click") {
                const div = document.createElement("div");
                div.className = "w-list-widget admin-out-log";
                div.style.width = "100%";
                new w_dialog({
                    title: "管理导出日志",
                    content: div,
                    isBlocking: true,
                    isDeleteBtn: true,
                    btns: [
                        ["外部编辑器打开", () => {
                            const filePath = OutLogPath + div.wSelectItemText;
                            DataDispose.OpenFileUsingExternal(filePath);
                            return false;
                        }],
                        ["删除文件", () => {
                            const name = div.wSelectItemText;
                            const file = new window.__CuteFox__.File(OutLogPath + name);
                            file.Delete();
                            WMessage({ message: "文件删除成功", place: "CB", time: 2100, EventName: "file-delete-ok" });
                            return false;
                        }],
                        ["取消", () => { return false; }]
                    ]
                });
                const arr = OutLog.GetFileList();
                forEnd(arr, (e) => {
                    const str = e.split('.');
                    if (str[str.length - 1] === "xls") {
                        div.wAddItem(e, "./Assets/img/svg/xlsx.svg");
                    } else {
                        div.wAddItem(e);
                    }
                });
                div.wSelect(0);
            }
        }
        $("#导入日志").w_Event = (event) => {
            if (event.wEventName === "click") {
                DataDispose.ImportData();
            }
        }
        $("#导出日志").w_Event = (event) => {
            if (event.wEventName === "click") {
                const div = document.createElement("div");
                div.className = "w-list-widget out-log";
                div.style.width = "100%";
                new w_dialog({
                    title: "导出日志",
                    content: div,
                    isBlocking: true,
                    isDeleteBtn: true,
                    btns: [
                        ["确定", () => {
                            const data = read_log(div.wSelectItemText);
                            DataDispose.OutData(JSON.stringify(data), div.wSelectItemText);
                            WMessage({ message: "导出日志成功", place: "CB", time: 2100, EventName: "out-log-ok" });
                            return false;
                        }],
                        ["取消", () => { return false; }]
                    ]
                });
                const arr = LogBase.GetFileList();
                forEnd(arr, (e) => {
                    div.wAddItem(e);
                });
                div.wSelect(0);
            }
        }
        $("#清理缓存数据").w_Event = (event) => {
            if (event.wEventName === "click") {
                const div = document.createElement("div");
                div.className = "w-list-widget clear-cache-data";
                div.style.width = "100%";
                new w_dialog({
                    title: "清理缓存数据",
                    content: div,
                    isBlocking: true,
                    isDeleteBtn: true,
                    btns: [
                        ["打开文件", () => {
                            const name = div.wSelectItemText;
                            DataDispose.OpenFileUsingExternal(AppCachePath + name);
                            return false;
                        }],
                        ["清理", () => {
                            const arr = AppCache.GetFileList();
                            forEnd(arr, (e) => {
                                const file = new window.__CuteFox__.File(AppCachePath + e, {
                                    inexistenceIsCreate: false
                                });
                                if (file.Exists()) {
                                    file.Delete();
                                }
                            });
                            WMessage({ message: "清理缓存数据成功", place: "CB", time: 2100, EventName: "clear-cache-data-ok" });
                            return false;
                        }],
                        ["取消", () => { return false; }]
                    ]
                });
                const arr = AppCache.GetFileList();
                forEnd(arr, (e) => {
                    div.wAddItem(e);
                });
                div.wSelect(0);
            }
        }
    })();

    // 表格 数据
    (function () {
        const name = Log_data.$(".name")[0];
        const allsize = Log_data.$(".allsize")[0];
        const allsize_row = allsize.$(".row")[0];
        const allsize_column = allsize.$(".column")[0];
        const nowcell = Log_data.$(".nowcell")[0];
        const nowcell_row = nowcell.$(".row")[0];
        const nowcell_column = nowcell.$(".column")[0];
        const nowcell_column_num = nowcell.$(".column-num")[0];

        name.w_Event = () => {
            const input = ControlGeneration.line_edit();
            new w_dialog({
                title: "修改当前日志名",
                content: input,
                isBlocking: true,
                isDeleteBtn: true,
                btns: [
                    ["确定修改", () => {
                        const value = input.wValue;
                        if (!isValidFilename(value)) {
                            WMessage({ message: "修改失败,含有特殊符号", place: "CC", time: 2500, EventName: "set-current-log-name-err" });
                            return;
                        }
                        const file = new window.__CuteFox__.File(LogBasePath + name.innerText);
                        file.Rename(value);
                        file.Close();
                        name.innerText = value;
                        SetConfig("LastOpenLog", value);
                        WMessage({ message: "修改成功", place: "CC", time: 2100, EventName: "set-current-log-name-ok" });
                        return false;
                    }],
                    ["取消", () => { return false; }],
                ]
            });
            input.wSetValue(name.innerText);
        }

        LogRecord_Table.wTableChange = (ChangeName, tag) => {
            allsize_row.innerText = LogRecord_Table.wGetRowNumber();
            allsize_column.innerText = LogRecord_Table.wGetColumnNumber();
            if (ChangeName === "DeleteRow") {
                if (parseInt(nowcell_row.innerText) === tag) {
                    nowcell_column.innerText = null;
                    nowcell_row.innerText = null;
                    nowcell_column_num.innerText = null;
                }
            }
            if (ChangeName === "DeleteColumn") {
                if (nowcell_column.innerText === tag) {
                    nowcell_column.innerText = null;
                    nowcell_row.innerText = null;
                    nowcell_column_num.innerText = null;
                }
            }
        }

        LogRecord_Table.wClickCell = (element, row, column) => {
            nowcell_row.innerText = row;
            nowcell_column.innerText = column;
            nowcell_column_num.innerText = `[${LogRecord_Table.wGetColumnToNumber(column)}]`;
        }


        {
            LogRecord_Table.wSetColumnNumber(5);
            LogRecord_Table.wSetRowNumber(3);
            const LastOpenLog = GetConfigStr("LastOpenLog");
            if (LastOpenLog === "") {
                name.innerText = getNowFormatDate("MM-DD-日志名");
            } else {
                const data = read_log(LastOpenLog);
                if (!data) {
                    WMessage({ message: "日志不存在", place: "CC", time: 2100, EventName: "log-not-exists" });
                } else if (data === "{}") {
                    WMessage({ message: "日志是空的", place: "CC", time: 2100, EventName: "log-are-air" });
                } else {
                    LogRecord_Table.wImportData(data);
                }
                name.innerText = LastOpenLog;
            }
            CurrentLog = new window.__CuteFox__.File(LogBasePath + name.innerText, {
                inexistenceIsCreate: false
            });
        }

        LogRecord_Table.wTableChange();

        LogRecord_Table.wAddSoleEventListener("input", (event) => {
            const TargetElement = event.target;
            set_saved_sign(false);
        });

        Process.push(LogRecord_Table.wOutData());

        //日志工具
        (function () {
            function notselectcell() {
                if (LogRecord_Table.wCurrentClickCell === null) {
                    WMessage({ message: "没有选择单元格", place: "CC", time: 2100, EventName: "not-select-cell" });
                    return false;
                }
                return true
            }
            function notselectRowOrColumn() {
                if (LogRecord_Table.wCurrentSelect === null) {
                    WMessage({ message: "没有选择行或列", place: "CC", time: 2100, EventName: "not-select-row-or-column" });
                    return false;
                }
                return true
            }
            let isDowndrop = true;
            LogRecord_Log_Tool.wAddSoleEventListener("click", (event) => {
                const element = event.target;
                switch (element.getAttribute("title")) {
                    case "下拉": {
                        isDowndrop = !isDowndrop;
                        if (isDowndrop) {
                            element.removeAttribute("rotate180");
                            LogRecord_Log_Tool.style.maxHeight = "85px";
                        } else {
                            element.setAttribute("rotate180", "");
                            LogRecord_Log_Tool.style.maxHeight = "42px";
                        }
                    } break;
                    case "添加行": {
                        LogRecord_Table.wAddRow();
                        set_saved_sign(false);
                    } break;
                    case "添加列": {
                        LogRecord_Table.wAddColumn();
                        set_saved_sign(false);
                    } break;
                    case "帮助": {
                        use_help();
                    } break;
                    case "选择行": {
                        if (!notselectcell()) return;
                        LogRecord_Table.wClearAllSelect();
                        LogRecord_Table.wSelectRowCell(LogRecord_Table.wCurrentClickCell.parentNode, 1, LogRecord_Table.wGetColumnNumber());
                    } break;
                    case "选择列": {
                        if (!notselectcell()) return;
                        LogRecord_Table.wClearAllSelect();
                        LogRecord_Table.wSelectColumnCell(nowcell_column.innerText, 1, LogRecord_Table.wGetRowNumber());
                    } break;
                    case "保存": {
                        set_saved_sign(true);
                    } break;
                    case "删除行或者列": {
                        if (notselectcell() && notselectRowOrColumn()) {
                            if (_WebUtilPro_isString(LogRecord_Table.wCurrentSelect))
                                LogRecord_Table.wDeleteColumn(LogRecord_Table.wCurrentSelect);
                            else
                                LogRecord_Table.wDeleteRow(LogRecord_Table.wCurrentSelect);
                            LogRecord_Table.wCurrentSelect = null;
                            set_saved_sign(false);
                        }
                    } break;
                    case "全选": {
                        LogRecord_Table.wSelectAllCell();
                    } break;
                    case "样式": {
                        if (!notselectcell()) return;
                        const div = document.createElement("div");
                        div.className = "w-vertical-layout";
                        div.innerHTML = `
                        <span>文本颜色</span>
                        <div class="w-line-edit" id="修改单元格样式_颜色"><input type="color" style="height: 50px;"></div>
                        <br>
                        <span>文本背景颜色</span>
                        <div class="w-line-edit" id="修改单元格样式_背景颜色"><input type="color" style="height: 50px;"></div>
                        `;
                        new w_dialog({
                            title: "修改单元格样式",
                            content: div,
                            isBlocking: true,
                            isDeleteBtn: true,
                            btns: [
                                ["确定", () => {
                                    LogRecord_Table.wCurrentClickCell.setAttribute("style", `color:${color.wValue}; background-color:${bgColor.wValue};`);
                                    LogRecord_Table.wCurrentClickCell.style.color = color.wValue;
                                    LogRecord_Table.wCurrentClickCell.style.backgroundColor = bgColor.wValue;
                                    set_saved_sign(false);
                                    return false;
                                }],
                                ["取消", () => { return false; }]
                            ]
                        });
                        var color = $("#修改单元格样式_颜色");
                        var bgColor = $("#修改单元格样式_背景颜色");
                    } break;
                    case "撤销": {
                        Process_index--;
                        Log_Step_Operator();
                        set_saved_sign(false, false);
                    } break;
                    case "恢复": {
                        Process_index++;
                        Log_Step_Operator();
                        set_saved_sign(false, false);
                    } break;
                    case "切换全屏模式编辑": {
                        if (ScreenStatus === 0) {
                            ScreenStatus = 1;
                            element.innerHTML = "&#xe0d6;";
                            LogRecord_Top_Logo.style.display = "none";
                            LogRecord_Bottom_Bar.style.display = "none";
                        } else {
                            ScreenStatus = 0;
                            element.innerHTML = "&#xe3c5;";
                            LogRecord_Top_Logo.style.display = "flex";
                            LogRecord_Bottom_Bar.style.display = "inline-flex";
                        }
                    } break;
                    case "插入行": {
                        if (!notselectcell()) return;
                        new w_dialog({
                            title: "",
                            content: "",
                            isBlocking: true,
                            isDeleteBtn: false,
                            btns: [
                                ["前", () => {
                                    LogRecord_Table.wInsertionRow(parseInt(nowcell_row.innerText) - 1);
                                    set_saved_sign(false);
                                    return false;
                                }, { paddingRight: "18px", paddingLeft: "18px" }],
                                ["后", () => {
                                    LogRecord_Table.wInsertionRow(parseInt(nowcell_row.innerText) - 1, true);
                                    set_saved_sign(false);
                                    return false;
                                }, { paddingRight: "18px", paddingLeft: "18px" }],
                                ["取消", () => { return false; }]
                            ]
                        });
                    } break;
                    case "插入列": {
                        if (!notselectcell()) return;
                        new w_dialog({
                            title: "",
                            content: "",
                            isBlocking: true,
                            isDeleteBtn: false,
                            btns: [
                                ["前", () => {
                                    LogRecord_Table.wInsertionColumn(nowcell_column.innerText);
                                    set_saved_sign(false);
                                    return false;
                                }, { paddingRight: "18px", paddingLeft: "18px" }],
                                ["后", () => {
                                    LogRecord_Table.wInsertionColumn(nowcell_column.innerText, true);
                                    set_saved_sign(false);
                                    return false;
                                }, { paddingRight: "18px", paddingLeft: "18px" }],
                                ["取消", () => { return false; }]
                            ]
                        });
                    } break;
                    case "删除当前日志": {
                        new w_dialog({
                            title: "删除当前日志",
                            content: "是否删除当前日志?",
                            isBlocking: true,
                            isDeleteBtn: true,
                            btns: [
                                ["删除", () => {
                                    WMessage({ message: "删除日志成功", place: "CB", time: 2100, EventName: "delete-log-ok" });
                                    const file = new window.__CuteFox__.File(LogBasePath + name.innerText);
                                    file.Rename(file.GetName() + "_" + generateUniqueId(8));
                                    file.Move(RecyclePath);
                                    return false;
                                }, { color: "red" }],
                                ["取消", () => { return false; }],
                            ]
                        });
                    } break;
                    case "新建日志": {
                        const input = ControlGeneration.line_edit();
                        new w_dialog({
                            title: "新建日志",
                            content: input,
                            isBlocking: true,
                            isDeleteBtn: true,
                            btns: [
                                ["创建", () => {
                                    const value = input.wValue;
                                    if (!isValidFilename(value)) {
                                        WMessage({ message: "设置失败,含有特殊符号", place: "CC", time: 2500, EventName: "create-set-current-log-name-err" });
                                        return;
                                    }
                                    const fileIS = new window.__CuteFox__.File(LogBasePath + value, {
                                        inexistenceIsCreate: false
                                    });
                                    if (fileIS.Exists()) {
                                        WMessage({ message: "创建失败,已存在同名日志", place: "CC", time: 2100, EventName: "create-log-no" });
                                    } else {
                                        const file = new window.__CuteFox__.File(LogBasePath + value);
                                        file.Write(JSON.stringify({ ColumnNumber: 5, RowNumber: 3, rows: [] }));
                                        file.Close();
                                        WMessage({ message: "日志创建成功", place: "CC", time: 2100, EventName: "create-log-ok" });
                                        return false;
                                    }
                                }],
                                ["取消", () => { return false; }],
                            ]
                        });
                        input.wSetValue(getNowFormatDate("MM-DD-日志名"));
                    } break;
                    case "编辑": {
                        if (notselectcell()) {
                            const div = document.createElement("textarea");
                            div.className = "w-text-edit";
                            div.style.width = "80vw";
                            div.style.height = "70vh";
                            new w_dialog({
                                title: "编辑",
                                content: div,
                                isBlocking: true,
                                isDeleteBtn: true,
                                btns: [
                                    ["确定", () => {
                                        LogRecord_Table.wCurrentClickCell.innerText = div.value;
                                        set_saved_sign(false);
                                        return false;
                                    }],
                                    ["取消", () => { return false; }]
                                ]
                            });
                            div.wSetValue(LogRecord_Table.wCurrentClickCell.innerText);
                        }
                    } break;
                    case "编辑其他日志": {
                        const div = document.createElement("div");
                        div.className = "w-list-widget edit-other-log";
                        div.style.width = "100%";
                        new w_dialog({
                            title: "编辑其他日志",
                            content: div,
                            isBlocking: true,
                            isDeleteBtn: true,
                            btns: [
                                ["确定", () => {
                                    Process = [];
                                    TableDataSet(read_log(div.wSelectItemText), div.wSelectItemText);
                                    return false;
                                }],
                                ["取消", () => { return false; }]
                            ]
                        });
                        const arr = LogBase.GetFileList();
                        forEnd(arr, (e) => {
                            div.wAddItem(e);
                        });
                        div.wSelect(0);
                    } break;
                    case "f(x)": {
                        const div = document.createElement("div");
                        div.innerHTML =
                            `<div class="w-line-edit" id="使用公式"><input type="text"></div>
                        <br>
                        <span>值: </span><span id="公式_值" style="user-select: text;-webkit-user-select: text;"></span>`
                            ;
                        new w_dialog({
                            title: "f(x)",
                            content: div,
                            isBlocking: true,
                            isDeleteBtn: true,
                            btns: [
                                ["取值", () => {
                                    const value = $("#使用公式").wValue;
                                    switch (value) {
                                        case "sum":
                                            let sum_v = 0;
                                            forEnd(LogRecord_Table.wGetSelect(), (e) => {
                                                const value = parseInt(e.innerText);
                                                if (value) sum_v += value;
                                            });
                                            $("#公式_值").innerText = sum_v;
                                            break;
                                        case "sumf":
                                            let sumf_v = 0.0;
                                            forEnd(LogRecord_Table.wGetSelect(), (e) => {
                                                const value = parseFloat(e.innerText);
                                                if (value) sumf_v += value;
                                            });
                                            $("#公式_值").innerText = sumf_v;
                                            break;
                                        default:
                                            break;
                                    }
                                }],
                                ["帮助", () => { fX_help() }],
                                ["关闭", () => { return false; }],
                            ]
                        });
                    } break;
                    case "选择": {
                        const div = document.createElement("div");
                        div.className = "w-vertical-layout";
                        div.innerHTML = `
                        <span>位置(选择行就填行号,列就填字母)</span>
                        <div class="w-line-edit" id="选择_位置"><input type="text"></div>
                        <br>
                        <span>开始</span>
                        <div class="w-line-edit" id="选择_从"><input type="text"></div>
                        <br>
                        <span>结束</span>
                        <div class="w-line-edit" id="选择_到"><input type="text"></div>
                        <br>
                        <div class="w-horizontal-layout">
                            <div class="w-switch-button" id="选择_是否清除旧选区">
                                <input class="w-checkbox-button" type="checkbox">
                            </div>
                            <span style="font-size: 11px;">是否清除旧选区</span>
                        </div>
                        `;
                        new w_dialog({
                            title: "选择",
                            content: div,
                            isBlocking: true,
                            isDeleteBtn: true,
                            btns: [
                                ["确定", () => {
                                    const v1 = $("#选择_位置").wValue;
                                    const v2 = parseInt($("#选择_从").wValue);
                                    const v3 = parseInt($("#选择_到").wValue);
                                    if ($("#选择_是否清除旧选区").wState()) {
                                        LogRecord_Table.wClearAllSelect();
                                    }
                                    if (parseInt(v1)) {
                                        LogRecord_Table.wSelectRowCell(parseInt(v1), v2, v3);
                                    } else {
                                        LogRecord_Table.wSelectColumnCell(v1, v2, v3);
                                    }
                                    return false;
                                }],
                                ["取消", () => { return false; }]
                            ]
                        });
                        $("#选择_是否清除旧选区").wSetState(true);
                    } break;

                    default:
                        break;
                }
            });
        })();
    })();
}

