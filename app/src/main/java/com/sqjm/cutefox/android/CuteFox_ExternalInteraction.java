package com.sqjm.cutefox.android;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import com.sqjm.cutefox.CuteFox;
import org.apache.logging.log4j.Logger;

import java.util.ArrayList;

public class CuteFox_ExternalInteraction {

    public static String GoBrowser(ArrayList<Object> obj) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse((String) obj.get(0)));
            Context mContext = (Context) CuteFox.CoreObject;
            mContext.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CuteFox.ReturnCodeJson();
    }
}
