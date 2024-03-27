package com.sqjm.cutefox.android;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.webkit.JavascriptInterface;

import com.sqjm.cutefox.CuteFox;

import org.apache.logging.log4j.Logger;

import java.util.ArrayList;
import java.util.Objects;

public class CuteFox_Application {
    public static String Exit(ArrayList<Object> obj) {
        double status = (double) obj.get(0);
        new Thread(() -> {
            try {
                Thread.sleep(500);
                System.exit((int) status);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        return CuteFox.ReturnCodeJson("window.close()");
    }

    public static String GetCurrentPath(ArrayList<Object> obj) {
        return CuteFox.ReturnCodeJson(System.getProperty("user.dir"));
    }

    public static String GetClassPath(ArrayList<Object> obj) {
        return CuteFox.ReturnCodeJson(Objects.requireNonNull(CuteFox.class.getResource("")).getPath());
    }

    public static String GetPackageName(ArrayList<Object> obj) {
        return CuteFox.ReturnCodeJson(CuteFox.class.getPackage().getName());
    }
}
