package com.sqjm.cutefox.android;

import com.google.gson.Gson;
import com.sqjm.cutefox.CuteFox;
import org.apache.logging.log4j.Logger;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class CuteFox_System {

    public static String GetSystemInfo(ArrayList<Object> obj) {
        Map<String, String> systemInfo = new HashMap<>();
        systemInfo.put("操作系统", System.getProperty("os.name"));
        systemInfo.put("操作系统版本", System.getProperty("os.version"));
        systemInfo.put("用户名", System.getProperty("user.name"));
        return CuteFox.ReturnCodeJson(new Gson().toJson(systemInfo));
    }
}
