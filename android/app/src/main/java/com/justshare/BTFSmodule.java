package com.justshare;


import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class BTFSmodule extends ReactContextBaseJavaModule
{
    long btfsThreadID = 0;
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

        Runnable btfsService = new Runnable() {
            @Override
            public void run() {
                try {
                    mainC(cmd);
                }
                catch (Exception e){
                    e.printStackTrace();
                }
            }
        };

        //private static final native String mainC(String in);
        Log.d("BTFSmodule","Commands to be send: "+ cmd);
        if(btfsThreadID==0) {       //If No BTFS threads have been started before start a new thread
            Thread btfsThread = new Thread(btfsService);
            btfsThreadID = btfsThread.getId();
            Log.d("New Thread ID:", btfsThreadID + "");
            btfsThread.start();
        }
        //mainC(cmd);
        //Log.d("BTFSModule",mainC(cmd));
        Log.d("BTFSModule","Hello from Android");
    }


}