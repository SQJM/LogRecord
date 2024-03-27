package com.sqjm.logrecord;

import android.graphics.Color;
import android.os.Build;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;

import androidx.annotation.RequiresApi;

public class StatusBar {
    private final Window window;

    public StatusBar(Window window) {
        this.window = window;
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @JavascriptInterface
    public void SetColor(double r,double g, double b) {
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.setStatusBarColor(Color.rgb((int) r, (int) g, (int) b));// 设置状态栏颜色
        }
    }

}
