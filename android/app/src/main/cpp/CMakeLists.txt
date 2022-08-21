# Sets the minimum version of CMake required to build your native library.
# This ensures that a certain set of CMake features is available to
# your build.

# Specifies a library name, specifies whether the library is STATIC or
# SHARED, and provides relative paths to the source code. You can
# define multiple libraries by adding multiple add_library() commands,
# and CMake builds them for you. When you build your app, Gradle
# automatically packages shared libraries with your APK.
cmake_minimum_required(VERSION 3.10.2)
add_library(foo SHARED IMPORTED)
#set_property(TARGET lib_foo PROPERTY IMPORTED_NO_SONAME 1)
set_target_properties( # Specifies the target library.
        foo

        # Specifies the parameter you want to define.
        PROPERTIES IMPORTED_LOCATION

        # Provides the path to the library you want to import.
        ../${ANDROID_ABI}/libfoo.so )

include_directories(../jniLibs/${CMAKE_ANDROID_ARCH_ABI}/)



#target_link_libraries( foo foo app-glue ${log-lib} )