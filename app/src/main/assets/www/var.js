const {
    w_dialog,
    IsEmptyInputControl,
    WMessage,
    resetRender,
    w_activity_widget,
    w_list_widget,
    w_context_menu,
    w_line_edit,
    ControlGeneration,
    _W_Event,
    w_drawer_widget
} = WebGUIPro;

const {
    $,
    forEnd,
    getNowFormatDate,
    isValidFilename,
    generateUniqueId
} = WebUtilPro;


const LogRecord_init_view = $("#LogRecord_init_view");
const LogRecord_Center_Content = $(".LogRecord_Center_Content")[0];
const LogRecord_Top_Logo = $(".LogRecord_Top_Logo")[0];
const LogRecord_Bottom_Bar = $(".LogRecord_Bottom_Bar")[0];
const LogRecord_Version_Update = $(".LogRecord_Version_Update")[0];
const LogRecord_Log_Tool = $(".LogRecord_Log_Tool")[0];
const LogRecord_Log_table = $(".LogRecord_Log_table")[0];
const LogRecord_Table = LogRecord_Log_table.$(".box")[0].$(".w-table")[0];
const Log_data = $(".Log_data")[0];
const LogRecord_Log_view_scale = $(".LogRecord_Log_view_scale")[0];


const AppCachePath = "/storage/emulated/0/Android/data/com.sqjm.LogRecord/cache/";
let AppCache = null;
const AppStoragePath = "/storage/emulated/0/Android/data/com.sqjm.LogRecord/files/";
const OutLogPath = AppStoragePath + "OutLog/";
let OutLog = null;
const RecyclePath = AppStoragePath + "Recycle/";
let Recycle = null;
const LogBasePath = AppStoragePath + "LogBase/";
let LogBase = null;
let ConfigIni = null;
const ConfigIniPath = AppStoragePath + "Config.ini";
const LogRecordVersion = "2.0.0.0";
let ScreenStatus = 0;

let Process = [];
let Process_index = 0;
let OldLogData = null;

let AutoSavedTimeId = null;

const ExternalControl = ExternalControl_init("./Page/Control.html");