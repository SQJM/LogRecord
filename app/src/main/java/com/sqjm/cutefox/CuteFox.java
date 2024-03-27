package com.sqjm.cutefox;

import android.content.Context;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.google.gson.Gson;
import io.undertow.Undertow;
import io.undertow.UndertowOptions;
import io.undertow.server.HttpServerExchange;
import io.undertow.util.Headers;
import io.undertow.util.StatusCodes;
import org.apache.logging.log4j.Logger;

import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.nio.ByteBuffer;
import java.util.*;

public class CuteFox {
    private static final String ROOT_FOLDER = "www";
    private final String HTTP_Server_IP = "localhost";
    private final int HTTP_Server_PORT;
    private final String OS_NAME;
    public static Object CoreObject;
    private Undertow undertow;
    public String AES_KEY = "HELLO_CuteFox!!!";

    public void User_HttpServerExchange(HttpServerExchange exchange) {
    }
    public boolean User_Parser(String classname) {
        return false;
    }

    public CuteFox(int port, Object obj) {
        CoreObject = obj;
        this.HTTP_Server_PORT = port;
        this.OS_NAME = System.getProperty("os.name").toLowerCase();
    }

    public String getServerIP() {
        return "http://" + HTTP_Server_IP + ":" + HTTP_Server_PORT + "/";
    }

    public static class RequestCode {
        public String classname;
        public String name;
        public ArrayList<Object> obj = new ArrayList<>();
    }

    public static class ReturnCode {
        public ArrayList<Object> obj = new ArrayList<>();
    }

    public static String ReturnCodeJson(Object... obj) {
        ReturnCode returnCode = new ReturnCode();
        if (obj != null && obj.length > 0) {
            returnCode.obj.addAll(Arrays.asList(obj));
        } else {
            returnCode.obj.add(null);
        }
        return new Gson().toJson(returnCode, ReturnCode.class);
    }

    public static Boolean[] convertToBooleanArray(Object obj) {
        if (obj instanceof List) {
            List<Boolean> boolList = (List<Boolean>) obj;
            return boolList.toArray(new Boolean[0]);
        }
        return new Boolean[]{};
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    public static String Android_parser(RequestCode code) {
        try {
            Class<?> myClass = Class.forName("com.sqjm.cutefox.android." + code.classname);
            Object instance = myClass.getDeclaredConstructor().newInstance();
            java.lang.reflect.Method method = myClass.getMethod(code.name, ArrayList.class);
            return (String) method.invoke(instance, code.obj);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (InvocationTargetException | InstantiationException | IllegalAccessException |
                 NoSuchMethodException e) {
            throw new RuntimeException(e);
        }
        return "Not Class or Function";
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    private String User_Code_Parser(RequestCode code) {
        try {
            Class<?> myClass = Class.forName(code.classname);
            Object instance = myClass.getDeclaredConstructor().newInstance();
            java.lang.reflect.Method method = myClass.getMethod(code.name, ArrayList.class);
            return (String) method.invoke(instance, code.obj);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (InvocationTargetException | InstantiationException | IllegalAccessException |
                 NoSuchMethodException e) {
            throw new RuntimeException(e);
        }
        return "Not Class or Function";
    }

    private ByteBuffer parser(String str) {
        RequestCode code = new Gson().fromJson(str, RequestCode.class);
        String data = "Without this platform";
        if (User_Parser(code.classname)) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                data = User_Code_Parser(code);
            }
        } else{
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                data = Android_parser(code);
            }
        }
        return ByteBuffer.wrap(data.getBytes());
    }

    public void startServer() {
        undertow = Undertow.builder()
                .addHttpListener(HTTP_Server_PORT, HTTP_Server_IP)
                .setServerOption(UndertowOptions.IDLE_TIMEOUT, 0)
                .setHandler(this::serve)
                .build();
        undertow.start();
    }

    public void stopServer() {
        if (undertow != null) {
            undertow.stop();
        }
    }

    public void serve(HttpServerExchange exchange) {
        User_HttpServerExchange(exchange);
        String uri = exchange.getRequestURI();

        // 判断是否是根路径
        if ("/".equals(uri)) {
            uri = "/index.html"; // 默认返回index.html
        } else if ("/CuteFox".equals(uri)) {
            exchange.dispatch(() -> {
                try {
                    exchange.getResponseHeaders().put(Headers.CONTENT_TYPE, "application/json");
                    exchange.startBlocking();
                    exchange.getResponseSender().send(parser(readInputStreamToString(exchange.getInputStream())));
                } catch (IOException e) {
                    e.printStackTrace();
                    exchange.setStatusCode(StatusCodes.INTERNAL_SERVER_ERROR);
                    exchange.getResponseSender().send("Error");
                }
            });
            return;
        }

        // 获取文件路径
        String filePath = ROOT_FOLDER + uri;

        // 读取文件内容
        byte[] fileContent;
        try {
            fileContent = getAssetAsByteArray(filePath);
        } catch (IOException e) {
            exchange.setStatusCode(StatusCodes.NOT_FOUND);
            exchange.getResponseSender().send(e.getMessage());
            return;
        }
        // 获取文件的MIME类型
        String mimeType = getMimeTypeForFile(filePath);

        // 返回响应
        exchange.getResponseHeaders().put(Headers.CONTENT_TYPE, mimeType);
        exchange.getResponseSender().send(ByteBuffer.wrap(fileContent));
    }


    private String readInputStreamToString(InputStream inputStream) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        StringBuilder stringBuilder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            stringBuilder.append(line);
        }
        reader.close();
        return stringBuilder.toString();
    }

    private byte[] getAssetAsByteArray(String filePath) throws IOException {
        Context mContext = (Context) CoreObject;
        byte[] fileBytes = null;
        try {
            InputStream inputStream = mContext.getAssets().open(filePath);
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            int nRead;
            byte[] data = new byte[4096];
            while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, nRead);
            }
            buffer.flush();
            fileBytes = buffer.toByteArray();
            inputStream.close();
            buffer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return fileBytes;
    }

    public static String getMimeTypeForFile(String filePath) {
        Map<String, String> mimeTypes = new HashMap<>();
        // MIME类型映射表
        mimeTypes.put(".html", "text/html");
        mimeTypes.put(".htm", "text/html");
        mimeTypes.put(".js", "application/javascript");
        mimeTypes.put(".css", "text/css");
        mimeTypes.put(".png", "image/png");
        mimeTypes.put(".jpg", "image/jpeg");
        mimeTypes.put(".jpeg", "image/jpeg");
        mimeTypes.put(".gif", "image/gif");
        mimeTypes.put(".svg", "image/svg+xml");
        mimeTypes.put(".txt", "text/plain");
        mimeTypes.put(".ttf", "font/ttf");
        mimeTypes.put(".otf", "font/otf");
        mimeTypes.put(".woff", "font/woff");
        mimeTypes.put(".woff2", "font/woff2");
        mimeTypes.put(".bin", "application/octet-stream");
        mimeTypes.put(".pdf", "application/pdf");
        mimeTypes.put(".doc", "application/msword");
        mimeTypes.put(".xls", "application/vnd.ms-excel");
        mimeTypes.put(".ppt", "application/vnd.ms-powerpoint");
        mimeTypes.put(".mp3", "audio/mpeg");
        mimeTypes.put(".wav", "audio/wav");
        mimeTypes.put(".mp4", "video/mp4");
        mimeTypes.put(".avi", "video/x-msvideo");
        mimeTypes.put(".json", "application/json");
        mimeTypes.put(".csv", "text/csv");
        mimeTypes.put(".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        mimeTypes.put(".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        mimeTypes.put(".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
        mimeTypes.put(".zip", "application/zip");
        mimeTypes.put(".tar", "application/x-tar");
        mimeTypes.put(".gz", "application/gzip");
        mimeTypes.put(".bz2", "application/x-bzip2");
        mimeTypes.put(".rar", "application/vnd.rar");
        mimeTypes.put(".7z", "application/x-7z-compressed");

        // 获取文件扩展名
        String fileExtension = filePath.substring(filePath.lastIndexOf("."));

        // 查找对应的MIME类型，如果找不到，默认返回"text/plain"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            return mimeTypes.getOrDefault(fileExtension, "text/plain");
        }
        return "text/plain";
    }
}


