package com.justshare;


import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
//import com.termux.terminal.TerminalEmulator;
//import com.termux.terminal.TerminalSession;
import com.termux.app.TermuxActivity;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.widget.ArrayAdapter;
import android.widget.Toast;
//import com.termux.terminal.JNI;

import static androidx.core.content.ContextCompat.startActivity;

//import com.justshare..TerminalSession.SessionChangedCallback;
public class MyBasicModule extends ReactContextBaseJavaModule {
  //  private Context context;






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
    //Custom function that we are going to export to JS
    //@ReactMethod
   // public void getDeviceName(Callback cb) {
   /* public void getDeviceName() {
        try{


           // JNI.createSubprocess("ls","/data/data/justshare/","","",1,1,1);
            cb.invoke(null, android.os.Build.MODEL);
            //String libPath = context.getApplicationInfo().nativeLibraryDir +"btfs";
            //System.load(termux);
            session.write("ls");
        }catch (Exception e){
            cb.invoke(e.toString(), null);
        }
    }*/

    @ReactMethod
   public void navigateToTerminal() {
        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(context, TermuxActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
        //Intent i = new Intent();
        //i.setClassName(context.getBaseContext(),"TermuxActivity");
       // startActivity(new Intent(Term.this, TermuxActivity.class));
    }






}
