package com.termux.app;

import android.app.Application;

import com.termux.shared.crash.CrashHandler;
import com.termux.shared.settings.preferences.TermuxAppSharedPreferences;
import com.termux.shared.logger.Logger;


public class TermuxApplication extends Application {
    public void onCreate() {
        super.onCreate();

        // Set crash handler for the app
        CrashHandler.setCrashHandler(this);

        // Set log level for the app
        setLogLevel();
    }

    private void setLogLevel() {
        // Load the log level from shared preferences and set it to the {@link Logger.CURRENT_LOG_LEVEL}
        TermuxAppSharedPreferences preferences = new TermuxAppSharedPreferences(getApplicationContext());
        preferences.setLogLevel(null, preferences.getLogLevel());
        Logger.logDebug("Starting Application");
    }
}

