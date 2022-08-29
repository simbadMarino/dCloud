package com.justshare;


import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class coreBTFSModule extends ReactContextBaseJavaModule
{
    public coreBTFSModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @Override
    public String getName() {
        return "coreBTFS";
    }

    @ReactMethod
    public void mainC(String in) {

            }


}