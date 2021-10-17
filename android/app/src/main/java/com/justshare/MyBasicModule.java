package com.justshare;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.termux.app.TermuxActivity;


public class MyBasicModule extends ReactContextBaseJavaModule {

    //constructor
    public MyBasicModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    /** The main view of the activity showing the terminal. Initialized in onCreate(). */
    @SuppressWarnings("NullableProblems")

    //Mandatory function getName that specifies the module name
    @Override
    public String getName() {
        return "Terminal";
    }


    @ReactMethod
    public void navigateToTerminal() {
        /**Start TermuxActivity activity when pressing terminal button**/
        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(context, TermuxActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);


        /*
        Intent intentBTFS = new Intent();
        intentBTFS.setClassName("com.justshare", "com.termux.app.RunCommandService");
        intentBTFS.setAction("com.justshare.RUN_COMMAND");
        intentBTFS.putExtra("com.justshare.RUN_COMMAND_PATH",      "/data/data/com.justshare/files/usr/bin/btfs");
        intentBTFS.putExtra("com.justshare.RUN_COMMAND_BACKGROUND", true);
        intentBTFS.putExtra("com.justshare.RUN_COMMAND_ARGUMENTS", new String[]{"daemon"});
        context.startService(intentBTFS);*/
    }

    @ReactMethod
    public void initBTFS_newWallet() {

    }

    @ReactMethod
    public void initBTFS_importWallet() {

    }

    @ReactMethod
    public void startBTFSDaemon() {
        /**Run a BTFS daemon command in background**/
        ReactApplicationContext context = getReactApplicationContext();
        Intent intentBTFS = new Intent();
        intentBTFS.setClassName("com.justshare", "com.termux.app.RunCommandService");
        intentBTFS.setAction("com.justshare.RUN_COMMAND");
        intentBTFS.putExtra("com.justshare.RUN_COMMAND_PATH",      "/data/data/com.justshare/files/usr/bin/btfs");
        intentBTFS.putExtra("com.justshare.RUN_COMMAND_BACKGROUND", true);
        intentBTFS.putExtra("com.justshare.RUN_COMMAND_ARGUMENTS", new String[]{"daemon"});
        context.startService(intentBTFS);

    }


    }


