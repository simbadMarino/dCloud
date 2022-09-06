package com.justshare;


import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class BTFSmodule extends ReactContextBaseJavaModule
{
    public native String mainC(String var0);

    public BTFSmodule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @Override
    public String getName() {
        return "BTFSmodule";
    }

    @ReactMethod
    public void main(String cmd,String dummy) {
        //private static final native String mainC(String in);
        Log.d("BTFSmodule","Commands to be send: "+ cmd);
        //mainC(cmd);
        Log.d("BTFSModule",mainC(cmd));
        Log.d("BTFSModule","Hello from Android");
    }


}