LOCAL_PATH:= $(call my-dir)
include $(CLEAR_VARS)
LOCAL_MODULE := foo
LOCAL_SRC_FILES := ../jniLibs/$(TARGET_ARCH_ABI)/libfoo.so
include $(PREBUILT_SHARED_LIBRARY)