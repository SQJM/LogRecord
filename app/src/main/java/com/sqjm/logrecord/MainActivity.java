package com.sqjm.logrecord;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebView;
import android.widget.Toast;

import com.sqjm.cutefox.CuteFox;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.file.Files;
import java.util.Objects;

public class MainActivity extends AppCompatActivity{
    public CuteFox cf = new CuteFox(9547,this);
    @SuppressLint("StaticFieldLeak")
    public static WebView mWebView = null;
    public static int backPressedCount = 0;
    @SuppressLint({"SetJavaScriptEnabled", "InlinedApi", "JavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        { // 权限检查
            GetPermissions.UseGetPermission(GetPermissions.permission.MANAGE_EXTERNAL_STORAGE,0x000010);
            GetPermissions.UseGetPermission(GetPermissions.permission.READ_EXTERNAL_STORAGE,0x000020);
            GetPermissions.UseGetPermission(GetPermissions.permission.WRITE_EXTERNAL_STORAGE,0x000030);
        }
        {
            View rootView = getWindow().getDecorView().getRootView();
            rootView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    backPressedCount = 0;
                }
            });
        }
        {
            mWebView = findViewById(R.id.webView);
            mWebView.addJavascriptInterface(new StatusBar(this.getWindow()),"StatusBar");
            mWebView.addJavascriptInterface(new AppScreen(),"AppScreen");
            mWebView.addJavascriptInterface(new DataDispose(),"DataDispose");
            mWebView.getSettings().setJavaScriptEnabled(true);
        }
        Log.d("sqjm", Objects.requireNonNull(getExternalFilesDir(null)).getAbsolutePath());
        new NetworkTask().execute(); // 执行异步任务
    }

    @SuppressLint("StaticFieldLeak")
    private class NetworkTask extends AsyncTask<Void, Void, Void> {
        @Override
        protected Void doInBackground(Void... voids) {
            cf.startServer();
            ((Activity) CuteFox.CoreObject).runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mWebView.loadUrl(cf.getServerIP() + "index.html");
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                    findViewById(R.id.imageView).setVisibility(View.INVISIBLE);
                }
            });
            return null;
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        if (backPressedCount == 0) {
            backPressedCount++;
            Toast.makeText(this, "再次返回退出应用", Toast.LENGTH_SHORT).show();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        backPressedCount = 0; // 在恢复到前台时重置计数器
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 0x000100 && resultCode == RESULT_OK) {
            if (data != null) {
                Uri uri = data.getData();
                try {
                    copyFileToAppData(uri);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private String readFileContent(Uri uri) {
        StringBuilder contentBuilder = new StringBuilder();
        try {
            ContentResolver resolver = getContentResolver();
            InputStream inputStream = resolver.openInputStream(uri);
            if (inputStream != null) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                String line;
                while ((line = reader.readLine()) != null) {
                    contentBuilder.append(line).append("\n");
                }
                inputStream.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return contentBuilder.toString();
    }

    private void copyFileToAppData(Uri uri) throws IOException {
        String filePath = GetFileFromContentUri.getFileAbsolutePath(this, uri);
        File file = new File(filePath);
        String fileName = "ImportFile.dat";
        File appDataDir = Objects.requireNonNull(getExternalFilesDir(null)).getAbsoluteFile(); // 获取应用程序数据目录
        File destFile = new File(appDataDir, fileName);

        InputStream inputStream = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            inputStream = Files.newInputStream(file.toPath());
        }
        OutputStream outputStream = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            outputStream = Files.newOutputStream(destFile.toPath());
        }

        byte[] buffer = new byte[1024];
        int length;
        while ((length = inputStream.read(buffer)) > 0) {
            outputStream.write(buffer, 0, length);
        }

        inputStream.close();
        outputStream.close();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            mWebView.evaluateJavascript("handleImportFile();",null);
        }
    }
}