
function initVar() {
    {
        const file = new window.__CuteFox__.File(ConfigIniPath, {
            isClearFileContent: false,
            isOverlayFile: false,
            inexistenceIsCreate: true
        });
        if (file.ReadAll() === "") {
            const text = `
[Config]
AutoSavedLog=false
CheckForAppUpdates=true
RightShowScaleButton=true
Backups=false
BackupsTime0=false
BackupsTime1=false
BackupsTime2=false
BackupsTime3=false
AgreeProtocol=false
BreakVersionUpdate=
LastOpenLog=
        `;
            file.Write(text);
        }
        file.Close();
        ConfigIni = new window.__CuteFox__.EasyIni(ConfigIniPath, "Config");
    }
    {
        LogBase = new window.__CuteFox__.File(LogBasePath, {
            inexistenceIsCreate: false
        });
        if (!LogBase.Exists()) {
            LogBase.CreateFolder(LogBasePath);
        } else if (GetConfig("CheckForAppUpdates")) GetVersionUpdate(true);
    }
    {
        Recycle = new window.__CuteFox__.File(RecyclePath, {
            inexistenceIsCreate: false
        });
        if (!Recycle.Exists()) {
            Recycle.CreateFolder(RecyclePath);
        }
    }
    {
        OutLog = new window.__CuteFox__.File(OutLogPath, {
            inexistenceIsCreate: false
        });
        if (!OutLog.Exists()) {
            OutLog.CreateFolder(OutLogPath);
        }
    }
    {
        AppCache = new window.__CuteFox__.File(AppCachePath, {
            inexistenceIsCreate: false
        });
        if (!AppCache.Exists()) {
            AppCache.CreateFolder(AppCachePath);
        }
    }
    
}

// 初始化加载界面主功能
function widget_initLoading_main() {
    StatusBar.SetColor(245, 245, 245);
    $(".LogRecord_Version_Update")[0].innerText = LogRecordVersion;
    {
        if (!GetConfig("AgreeProtocol")) About_FN_Use_Service_Agreement();
        event_bind();
        RefreshSettingsScreen();
    }
    setTimeout(() => {
        LogRecord_init_view.remove();
        StatusBar.SetColor(109, 211, 255);
    }, 1500);
}


function LogRecord_Main() {
    initVar();
    widget_initLoading_main();
}