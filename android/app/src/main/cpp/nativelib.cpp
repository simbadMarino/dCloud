#include <jni.h>
#include <string>
#include "libbtfs.h"

extern "C" JNIEXPORT jstring JNICALL
Java_com_justshare_MainActivity_stringFromJNI(
        JNIEnv* env,
        jclass clazz) {
    std::string hello = "Hello from C++";
    return env->NewStringUTF(hello.c_str());
}
extern "C" {
    jstring JNICALL
    Java_com_justshare_BTFSmodule_mainC(JNIEnv *env, jobject, jstring btfsCMD) {
        const char *cstr = env->GetStringUTFChars(btfsCMD, 0);
        //printf("Transformed Commands into %*C", cstr);
        char *cout = mainC(const_cast<char *>(cstr));
        jstring out = env->NewStringUTF(cout);
        //std::string hello = "Hello from C++ mainC function";
        env->ReleaseStringUTFChars(btfsCMD, cstr);
        free(cout);
        return out;
    }
}