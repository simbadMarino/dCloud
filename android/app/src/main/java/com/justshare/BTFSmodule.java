package com.justshare;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.concurrent.atomic.AtomicLong;

public class BTFSmodule extends ReactContextBaseJavaModule {

    // Used to generate a unique thread ID for each thread (Optional)
    private static AtomicLong threadCounter = new AtomicLong(0);

    public native String mainC(String var0);

    public BTFSmodule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "BTFSmodule";
    }

    @ReactMethod
    public void main(String cmd, String dummy) {

        // Runnable task to process the command
        Runnable btfsService = new Runnable() {
            @Override
            public void run() {
                try {
                    Log.d("BTFSmodule", "Executing command: " + cmd);
                    // Call your native method here
                    String exitCode = mainC(cmd);
                    Log.d("BTFSmodule", "Execution completed for command: " + cmd + " with exit code: " + exitCode );

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };

        // Each time a command is received, start a new thread for it
        Thread btfsThread = new Thread(btfsService);
        long threadId = threadCounter.incrementAndGet(); // Generate a unique thread ID

        Log.d("BTFSmodule", "Starting new thread. Thread ID: " + threadId);
        btfsThread.start();

        Log.d("BTFSmodule", "Thread created for command: " + cmd);
    }
}
