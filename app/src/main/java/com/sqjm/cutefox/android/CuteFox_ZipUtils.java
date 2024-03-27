package com.sqjm.cutefox.android;


import android.os.Build;

import com.sqjm.cutefox.CuteFox;
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import net.lingala.zip4j.model.FileHeader;
import net.lingala.zip4j.model.ZipParameters;
import net.lingala.zip4j.model.enums.AesKeyStrength;
import net.lingala.zip4j.model.enums.EncryptionMethod;
import org.apache.logging.log4j.Logger;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

public class CuteFox_ZipUtils {

    public static String CompressFile(ArrayList<Object> obj) {
        String filePath = (String) obj.get(0);
        String targetFilePath = (String) obj.get(1);
        String password = (String) obj.get(2);
        try {
            ZipFile zipFile = new ZipFile(targetFilePath);
            ZipParameters parameters = new ZipParameters();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.GINGERBREAD) {
                if (password != null && !password.isEmpty()) {
                    parameters.setEncryptFiles(true);
                    parameters.setEncryptionMethod(EncryptionMethod.AES);
                    zipFile.setPassword(password.toCharArray());
                    parameters.setAesKeyStrength(AesKeyStrength.KEY_STRENGTH_128);
                }
            }
            zipFile.addFile(filePath, parameters);
            zipFile.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CuteFox.ReturnCodeJson();
    }

    public static String CompressFolder(ArrayList<Object> obj) {
        String folderPath = (String) obj.get(0);
        String targetFilePath = (String) obj.get(1);
        String password = (String) obj.get(2);
        try {
            ZipFile zipFile = new ZipFile(targetFilePath);
            ZipParameters parameters = new ZipParameters();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.GINGERBREAD) {
                if (password != null && !password.isEmpty()) {
                    parameters.setEncryptFiles(true);
                    parameters.setEncryptionMethod(EncryptionMethod.AES);
                    zipFile.setPassword(password.toCharArray());
                    parameters.setAesKeyStrength(AesKeyStrength.KEY_STRENGTH_128);
                }
            }
            parameters.setIncludeRootFolder(false);
            File folder = new File(folderPath);
            if (folder.isDirectory()) {
                zipFile.addFolder(folder, parameters);
            }
            zipFile.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CuteFox.ReturnCodeJson();
    }

    public static String DecompressFile(ArrayList<Object> obj) {
        String zipFilePath = (String) obj.get(0);
        String destFolderPath = (String) obj.get(1);
        String password = (String) obj.get(2);
        ZipFile zipFile = null;
        try {
            zipFile = new ZipFile(zipFilePath);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.GINGERBREAD) {
                if (zipFile.isEncrypted() && (password == null || password.isEmpty())) {
                    return CuteFox.ReturnCodeJson(false);
                }
            }
            if (zipFile.isEncrypted()) {
                zipFile.setPassword(password.toCharArray());
            }
            zipFile.extractAll(destFolderPath);
            return CuteFox.ReturnCodeJson(true);
        } catch (ZipException e) {
            e.printStackTrace();
        } finally {
            if (zipFile != null) {
                try {
                    zipFile.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return CuteFox.ReturnCodeJson(false);
    }

    public static String ExtractFile(ArrayList<Object> obj) {
        String zipFilePath = (String) obj.get(0);
        String destFolderPath = (String) obj.get(1);
        String fileName = (String) obj.get(2);
        String password = (String) obj.get(3);
        ZipFile zipFile = null;
        try {
            zipFile = new ZipFile(zipFilePath);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.GINGERBREAD) {
                if (zipFile.isEncrypted() && (password == null || password.isEmpty())) {
                    return CuteFox.ReturnCodeJson(false);
                }
            }
            if (zipFile.isEncrypted()) {
                zipFile.setPassword(password.toCharArray());
            }
            FileHeader fileHeader = zipFile.getFileHeader(fileName);
            if (fileHeader == null) {
                return CuteFox.ReturnCodeJson(false);
            }
            zipFile.extractFile(fileHeader, destFolderPath);
            return CuteFox.ReturnCodeJson(true);
        } catch (ZipException e) {
            e.printStackTrace();
        } finally {
            if (zipFile != null) {
                try {
                    zipFile.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return CuteFox.ReturnCodeJson(false);
    }

}
