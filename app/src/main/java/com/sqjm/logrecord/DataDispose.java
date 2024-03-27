package com.sqjm.logrecord;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import com.google.gson.Gson;
import com.sqjm.cutefox.CuteFox;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import java.io.File;
import java.util.ArrayList;
import java.util.Objects;

public class DataDispose {
    static class Data {
        private int ColumnNumber;
        private int RowNumber;
        private ArrayList<ArrayList<ArrayList<String>>> rows;

        public int getColumnNumber() {
            return ColumnNumber;
        }

        public void setColumnNumber(int columnNumber) {
            ColumnNumber = columnNumber;
        }

        public int getRowNumber() {
            return RowNumber;
        }

        public void setRowNumber(int rowNumber) {
            RowNumber = rowNumber;
        }

        public ArrayList<ArrayList<ArrayList<String>>> getRows() {
            return rows;
        }

        public void setRows(ArrayList<ArrayList<ArrayList<String>>> rows) {
            this.rows = rows;
        }
    }

    @JavascriptInterface
    public void ImportData() {
            Activity mActivity  = (Activity ) CuteFox.CoreObject;
            Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
            intent.setType("*/*"); // 任意类型的文件
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            mActivity.startActivityForResult(intent, 0x000100);
    }

    @JavascriptInterface
    public static String handleImportFile() {
        try {
            File file = new File("/storage/emulated/0/Android/data/com.sqjm.LogRecord/files/ImportFile.dat");
            Workbook workbook = Workbook.getWorkbook(file);

            Sheet sheet = workbook.getSheet(0);
            int numRows = sheet.getRows();
            int numCols = sheet.getColumns();

            ArrayList<ArrayList<ArrayList<String>>> rows = new ArrayList<>();

            for (int i = 0; i < numRows; i++) {
                ArrayList<ArrayList<String>> rowData = new ArrayList<>();
                for (int j = 0; j < numCols; j++) {
                    Cell cell = sheet.getCell(j, i);
                    String value = cell.getContents();
                    ArrayList<String> cellData = new ArrayList<>();
                    cellData.add(value);
                    rowData.add(cellData);
                }
                rows.add(rowData);
            }

            Data data = new Data();
            data.setRowNumber(numRows);
            data.setColumnNumber(numCols);
            data.setRows(rows);
            workbook.close();
            return new Gson().toJson(data);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "null";
    }

    @JavascriptInterface
    public void OutData(String json, String name) {
        Gson gson = new Gson();
        Data data = gson.fromJson(json, Data.class);

        try {
            Context mContext = (Context) CuteFox.CoreObject;
            File fileInternal = new File(Objects.requireNonNull(mContext.getExternalFilesDir(null)).getAbsolutePath() + "/OutLog", name+".xls");
            WritableWorkbook workbook = Workbook.createWorkbook(fileInternal);
            WritableSheet sheet = workbook.createSheet("SQJM", 0);

            for (int i = 0; i < data.getRowNumber(); i++) {
                for (int j = 0; j < data.getColumnNumber(); j++) {
                    ArrayList<String> values = data.getRows().get(i).get(j);
                    Label label = new Label(j, i, values.get(0));
                    sheet.addCell(label);
                }
            }

            workbook.write();
            workbook.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @SuppressLint("QueryPermissionsNeeded")
    @JavascriptInterface
    public void OpenFileUsingExternal(String filePath){
        Context mContext = (Context) CuteFox.CoreObject;
        File tempFile = new File(filePath);

        // 获取FileProvider的URI
        Uri fileUri = FileProvider.getUriForFile(mContext, mContext.getApplicationContext().getPackageName() + ".fileprovider", tempFile);

        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(fileUri, "*/*");
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        if (intent.resolveActivity(mContext.getPackageManager()) != null) {
            mContext.startActivity(intent);
        } else {
            // 如果没有找到任何应用程序来处理该intent，你可以在这里给出一个提示
            Toast.makeText(mContext, "未找到适合打开该文件的应用程序", Toast.LENGTH_SHORT).show();
        }
    }
}
