#include <jni.h>
#include <string>

extern "C" JNIEXPORT jstring JNICALL
Java_com_btfs_nativelib_NativeLib_stringFromJNI(
        JNIEnv* env,
        jobject /* this */) {
    std::string hello = "Hello from C++";
    return env->NewStringUTF(hello.c_str());
}
extern "C"
JNIEXPORT jstring JNICALL
Java_com_justshare_MainActivity_mainC(JNIEnv *env, jclass clazz, jstring var0) {
    // TODO: implement mainC()
}