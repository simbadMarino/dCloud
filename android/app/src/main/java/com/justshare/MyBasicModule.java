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
        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(context, TermuxActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
         context.startActivity(intent);
        //Intent i = new Intent();
        //i.setClassName(context.getBaseContext(),"TermuxActivity");
       // startActivity(new Intent(Term.this, TermuxActivity.class));
       /* Intent intent = new Intent();
        intent.setClassName("com.termux", "com.termux.app.RunCommandService");
        intent.setAction("com.termux.RUN_COMMAND");
        intent.putExtra("com.termux.RUN_COMMAND_PATH", "/data/data/com.justshare/files/usr/bin/btfs");
       // intent.putExtra("com.termux.RUN_COMMAND_ARGUMENTS", new String[]{"-n", "5"});
        intent.putExtra("com.termux.RUN_COMMAND_WORKDIR", "/data/data/com.justshare/files/home");
        intent.putExtra("com.termux.RUN_COMMAND_BACKGROUND", true);
        context.startService(intent);*/
    }

}
