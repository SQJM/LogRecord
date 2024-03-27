package com.sqjm.cutefox.android;

import com.sqjm.cutefox.CuteFox;
import org.apache.logging.log4j.Logger;
import org.ini4j.Ini;
import org.ini4j.IniPreferences;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.prefs.Preferences;

public class CuteFox_EasyIni {
    public static Map<String, File> FileMap = new HashMap<>();
    public static Map<String, Ini> IniMap = new HashMap<>();
    public static String Init(ArrayList<Object> obj) {
        String id = (String) obj.get(0);
        String filePath = (String) obj.get(1);
        File file = new File(filePath);
        try {
            if (!file.exists()) {
                if (file.createNewFile()) {
                    Ini ini = new Ini(file);
                    IniMap.put(id, ini);
                    FileMap.put(id, file);
                    return CuteFox.ReturnCodeJson(true);
                } else {
                    return CuteFox.ReturnCodeJson(false);
                }
            } else {
                Ini ini = new Ini(file);
                IniMap.put(id, ini);
                FileMap.put(id, file);
                return CuteFox.ReturnCodeJson(true);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return CuteFox.ReturnCodeJson(false);
    }

    public static String GetKey(ArrayList<Object> obj) {
        String id = (String) obj.get(0);
        String section = (String) obj.get(1);
        String key = (String) obj.get(2);
        Ini ini = IniMap.get(id);
        if (ini != null) {
            Preferences prefs = new IniPreferences(ini);
            return CuteFox.ReturnCodeJson(prefs.node(section).get(key, null));
        } else {
            return CuteFox.ReturnCodeJson(false);
        }
    }

    public static String SetKey(ArrayList<Object> obj) {
        String id = (String) obj.get(0);
        String section = (String) obj.get(1);
        String key = (String) obj.get(2);
        String value = (String) obj.get(3);
        Ini ini = IniMap.get(id);
        if (ini != null) {
            Preferences prefs = new IniPreferences(ini);
            prefs.node(section).put(key, value);
            return CuteFox.ReturnCodeJson(true);
        } else {
            return CuteFox.ReturnCodeJson(false);
        }
    }

    public static String RemoveKey(ArrayList<Object> obj) {
        String id = (String) obj.get(0);
        String section = (String) obj.get(1);
        String key = (String) obj.get(2);
        Ini ini = IniMap.get(id);
        if (ini != null) {
            Preferences prefs = new IniPreferences(ini);
            prefs.node(section).remove(key);
            return CuteFox.ReturnCodeJson(true);
        } else {
            return CuteFox.ReturnCodeJson(false);
        }
    }

    public static String CreateSection(ArrayList<Object> obj) {
        String id = (String) obj.get(0);
        String section = (String) obj.get(1);
        Ini ini = IniMap.get(id);
        if (ini != null) {
            ini.put(section, null, null);
            return CuteFox.ReturnCodeJson(true);
        } else {
            return CuteFox.ReturnCodeJson(false);
        }
    }

    public static String RemoveSection(ArrayList<Object> obj) {
        String id = (String) obj.get(0);
        String section = (String) obj.get(1);
        Ini ini = IniMap.get(id);
        if (ini != null) {
            ini.remove(section);
            return CuteFox.ReturnCodeJson(true);
        } else {
            return CuteFox.ReturnCodeJson(false);
        }
    }

    public static String Save(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        String iniId = (String) obj.get(0);
        Ini ini = IniMap.get(iniId);
        File file = FileMap.get(fileId);
        if (ini != null && file != null) {
            try {
                ini.store(file);
                return CuteFox.ReturnCodeJson(true);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return CuteFox.ReturnCodeJson(false);
    }

    public static String Close(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        String iniId = (String) obj.get(0);
        IniMap.remove(iniId);
        FileMap.remove(fileId);
        return CuteFox.ReturnCodeJson();
    }
}