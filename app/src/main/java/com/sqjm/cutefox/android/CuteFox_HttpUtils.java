package com.sqjm.cutefox.android;

import com.sqjm.cutefox.CuteFox;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

public class CuteFox_HttpUtils {
    public static String SendGetRequest(ArrayList<Object> obj) throws IOException {
        String url = (String) obj.get(0);
        HttpURLConnection connection = null;
        BufferedReader reader = null;
        StringBuilder response = new StringBuilder();

        try {
            URL requestUrl = new URL(url);
            connection = (HttpURLConnection) requestUrl.openConnection();
            connection.setRequestMethod("GET");

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
            } else {
                throw new IOException("HTTP GET Request Failed with response code: " + responseCode);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            if (reader != null) {
                reader.close();
            }
            if (connection != null) {
                connection.disconnect();
            }
        }
        return CuteFox.ReturnCodeJson(response.toString());
    }
}
