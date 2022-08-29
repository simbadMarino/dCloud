package com.btfs.nativelib

import android.util.Log

class NativeLib {

    /**
     * A native method that is implemented by the 'nativelib' native library,
     * which is packaged with this application.
     */
    external fun stringFromJNI(): String

    companion object {
        // Used to load the 'nativelib' library on application startup.
        init {
            Log.d("LIB_LOAD", "Loading BTFS library")
            System.loadLibrary("nativelib")
            System.loadLibrary("foo")
        }
    }
}