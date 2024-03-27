package com.sqjm.cutefox.android;

import android.os.Build;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.sqjm.cutefox.CuteFox;
import org.apache.logging.log4j.Logger;

import java.io.*;
import java.lang.reflect.Array;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class CuteFox_File {
    public static Map<String, File> FileMap = new HashMap<>();

    public static String AddFile(ArrayList<Object> obj) throws IOException {
        String fileId = (String) obj.get(0);
        String filePath = (String) obj.get(1);
        Boolean[] operation = CuteFox.convertToBooleanArray(obj.get(2));
        File file = new File(filePath);
        FileMap.put(fileId, file);
        if (file.exists()) {
            if (Boolean.TRUE.equals(operation[0])) {
                FileWriter fileWriter = new FileWriter(file);
                fileWriter.write("");
                fileWriter.close();
            }
            if (Boolean.TRUE.equals(operation[1])) {
                file.delete();
                file.createNewFile();
            }
        } else {
            if (Boolean.TRUE.equals(operation[2])) {
                file.createNewFile();
            }
        }
        return CuteFox.ReturnCodeJson();
    }

    public static String Close(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        if (FileMap.containsKey(fileId)) {
            FileMap.remove(fileId);
            return CuteFox.ReturnCodeJson(true);
        } else {
            return CuteFox.ReturnCodeJson(false);
        }
    }

    public static String GetLineNumber(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        int lines = 0;
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            while (reader.readLine() != null) {
                lines++;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return CuteFox.ReturnCodeJson(lines);
    }

    public static String ReadLine(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        Double line = (Double) obj.get(1);
        File file = FileMap.get(fileId);

        int lines = 0;
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String currentLine;
            while ((currentLine = reader.readLine()) != null) {
                if (line.intValue() == lines) {
                    return CuteFox.ReturnCodeJson(currentLine);
                }
                lines++;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return CuteFox.ReturnCodeJson(lines);
    }

    public static String ReadAll(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return CuteFox.ReturnCodeJson(content.toString());
    }

    public static String Exists(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        return CuteFox.ReturnCodeJson(file.exists());
    }

    public static String IsFile(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        return CuteFox.ReturnCodeJson(file.isFile());
    }

    public static String SetReadOnly(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        return CuteFox.ReturnCodeJson(file.setReadOnly());
    }

    public static String SetWritable(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.GINGERBREAD) {
            return CuteFox.ReturnCodeJson(file.setWritable(true));
        }
        return CuteFox.ReturnCodeJson();
    }

    public static String Rename(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        String newFileName = (String) obj.get(1);
        File file = FileMap.get(fileId);
        File newFile = new File(file.getParentFile(), newFileName);
        boolean success = file.renameTo(newFile);
        if (success) {
            FileMap.put(fileId, newFile);
        }
        return CuteFox.ReturnCodeJson(success);
    }

    public static String GetFileInfoList(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        JsonArray fileList = new JsonArray();
                JsonObject fileInfo = new JsonObject();
                fileInfo.addProperty("name", file.getName());
                fileInfo.addProperty("path", file.getAbsolutePath());
                fileInfo.addProperty("isFile", file.isFile());
                fileInfo.addProperty("isDirectory", file.isDirectory());
                fileInfo.addProperty("size", file.length());
                fileInfo.addProperty("lastModifiedTime", file.lastModified());
                fileList.add(fileInfo);
        return CuteFox.ReturnCodeJson(fileList);
    }

    public static String GetFileList(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        JsonArray fileList = new JsonArray();
        File[] files = file.listFiles();
        if (files != null) {
            for (File f : files) {
                fileList.add(f.getName());
            }
        }
        return CuteFox.ReturnCodeJson(fileList);
    }

    public static String Copy(ArrayList<Object> obj) throws IOException {
        String fileId = (String) obj.get(0);
        String targetFolderPath = (String) obj.get(1);
        File sourceFile = FileMap.get(fileId);
        File targetFolder = new File(targetFolderPath);
        if (!targetFolder.exists()) {
            targetFolder.mkdirs();
        }
        File targetFile = new File(targetFolder, sourceFile.getName());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Files.copy(sourceFile.toPath(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        }
        return CuteFox.ReturnCodeJson(true);
    }

    public static String CreateFolder(ArrayList<Object> obj) {
        String folderPath = (String) obj.get(0);
        File folder = new File(folderPath);
        return CuteFox.ReturnCodeJson(folder.mkdirs());
    }

    public static String CreateCurrentFolder(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        String name = (String) obj.get(0);
        File folder = new File(FileMap.get(fileId).getPath() + name);
        return CuteFox.ReturnCodeJson(folder.mkdirs());
    }

    public static String Move(ArrayList<Object> obj) throws IOException {
        String fileId = (String) obj.get(0);
        String targetFolderPath = (String) obj.get(1);
        File sourceFile = FileMap.get(fileId);
        File targetFolder = new File(targetFolderPath);
        if (!targetFolder.exists()) {
            targetFolder.mkdirs();
        }
        File targetFile = new File(targetFolder, sourceFile.getName());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Files.move(sourceFile.toPath(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        }
        if (FileMap.containsKey(fileId)) {
            FileMap.put(fileId, targetFile);
        }
        return CuteFox.ReturnCodeJson(true);
    }

    public static String CreateFile(ArrayList<Object> obj) throws IOException {
        String path = (String) obj.get(0);
        File file = new File(path);
        return CuteFox.ReturnCodeJson(file.createNewFile());
    }

    public static String CreateCurrentFile(ArrayList<Object> obj) throws IOException {
        String fileId = (String) obj.get(0);
        String name = (String) obj.get(0);
        File file = new File(FileMap.get(fileId).getPath() + name);
        return CuteFox.ReturnCodeJson(file.createNewFile());
    }

    public static String Write(ArrayList<Object> obj) throws IOException {
        String fileId = (String) obj.get(0);
        String content = (String) obj.get(1);
        File file = FileMap.get(fileId);
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(content);
        }
        return CuteFox.ReturnCodeJson();
    }

    public static String Append(ArrayList<Object> obj) throws IOException {
        String fileId = (String) obj.get(0);
        String content = (String) obj.get(1);
        Boolean[] operation = CuteFox.convertToBooleanArray(obj.get(2));
        File file = FileMap.get(fileId);
        try (FileWriter writer = new FileWriter(file, true)) {
            writer.write(content);
        }
        return CuteFox.ReturnCodeJson();
    }

    public static String GetLastModifiedTime(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        return CuteFox.ReturnCodeJson(file.lastModified());
    }

    public static String GetFileSize(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        return CuteFox.ReturnCodeJson(file.length());
    }

    public static String IsDirectory(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        return CuteFox.ReturnCodeJson(file.isDirectory());
    }

    public static String GetName(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        return CuteFox.ReturnCodeJson(file.getName());
    }

    public static String GetAbsolutePath(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        return CuteFox.ReturnCodeJson(file.getAbsolutePath());
    }

    public static String GetParent(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        return CuteFox.ReturnCodeJson(file.getParent());
    }

    public static String GetPath(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        return CuteFox.ReturnCodeJson(file.getPath());
    }

    public static String Delete(ArrayList<Object> obj) {
        String fileId = (String) obj.get(0);
        File file = FileMap.get(fileId);
        Close(obj);
        return CuteFox.ReturnCodeJson(file.delete());
    }
}
