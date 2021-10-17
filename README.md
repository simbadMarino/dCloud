# dCloud
dCloud is a Full node app for descentralized storage solution

The starting goal of dCloud is to create a seamless and masses ready app for Descentralized Cloud Storage(DCS) solutions. As a starting point and due to the possibility of having a light Full Node BTFS was picked up as the dCloud DCS.

dCloud is basically an Integration of [Termux](https://github.com/termux) + BTFS DCS + React Native GUI. dCloud propposed architecture is shown below:

[dCloud BTFS](https://user-images.githubusercontent.com/11146636/121807867-97ece480-cc1b-11eb-9bcf-f97be0c34b21.png)


**Getting started**

Currently dCloud is only available for Android due to limitations on how iOS manages binary files, however further investigation/implementation is planned to release an iOS version.

As a Google Play / F-Droid version is not ready yet you will need to install dCloud using 

a) Compiling from Android Studio by cloning this repo and performing the following actions:

  1. Perform a `yarn install` in the dCloud root folder to install ALL react-native dependencies ( "react": "16.13.1","react-native": "0.63.4" versions were tested and currently working, any other version might have some unknown issues)
  2. Open the android project using Android Studio and select updatedDebug or updatedRelease![image](https://user-images.githubusercontent.com/11146636/137638913-77649e84-cfca-4cd0-aa4a-214ac6114263.png)

  3. Perform a "make project" to verify all dependencies are available and configured. 
  4. Run or create the APK and test either on your phone or emulator
  5. Enjoy :)

*Notes about boostrap packages and architectures: 
  If bootstrap installation keeps failing with "not executable : `32-bit ELF file` or similar errors in terminal tab please try installing the specific APK per architecture or comment non applicable bootstrap packages from `termux-bootstrap-zip.S` file if you are installing from source code.

b) Downloading latest apk:
  Option 1: Contact me on telegram and I can forward you the APK installer
  Option 2: Download the APK directly from the btfs gateway (file is splitted in 2 files):
            File 1: Pending
            File2: Pending
            

Once the installation is successful you need to open the terminal GUI and initialize the btfs services by sending the following commands:

  1. `btfs init`
  2. `btfs wallet password "YOUR_PASSWORD_HERE_NO_SPECIAL_CHARACTERS_ALLOWED"`
  3. `btfs daemon`

Optionally, if you already have a private key with some BTT do the following instead:

  1. `btfs init -i "PASTE_YOUR_PRIVATE_KEY_HERE"`
  2. `btfs wallet password "YOUR_PASSWORD_HERE_NO_SPECIAL_CHARACTERS_ALLOWED"`
  3. `btfs daemon`


After this please restart your dCloud app and the GUI should show you the Host UI and your current balance in the Renter tab. From here you can use your app as a full BTFS node.

**HOW TO BUILD CUSTOM BOOTSTRAP PACKAGE FOR ANDROID 10 (EXPERIMENTAL procedure credit goes to: agnostic-apollo from Termux)**

This method is currently under experimental usage, there is not guarantee this will work forever, so, in later releases I'll be moving towards reducing dependencies on termux.

`build-bootstraps.sh` script locally cross-compile the bootstrap package debs and create bootstrap zips. It is working for a different PREFIX to be ported to the official termux app without reworing termux code.  On-device (termux in mobile) builds are not supported currently, so use PC (cross-compile in docker).

Firstly, you need to pull the latest changes from [termux-packages](https://github.com/termux/termux-packages) repo, I just committed some stuff. (package source urls got outdated since old versions were removed by respective hosters)

Then

1. Set the TERMUX_APP_PACKAGE value in properties.sh to your app's package name.
2. Place the [build-bootstraps.zip](https://github.com/simbadMarino/dCloud/files/7174712/build-bootstraps.zip)
 in termux-packages/scripts directory.
3. Run cd termux-packages
4. Run ./scripts/run-docker.sh ./scripts/build-bootstraps.sh &> build.log to compile for all archs. You should find the bootstrap-*.zip in the termux-packages directory. If you want to compile only for a specific arch like aarch64, then run ./scripts/run-docker.sh ./scripts/build-bootstraps.sh --architectures aarch64 &> build.log. You can pass additional comma-separated list of packages that should be included in the bootstrap in addition to the default ones with the -add option.
5. Replace/place the zips in termux-app/app/src/main/cpp.
6. Add a return statement at start of downloadBootstrap() function in termux-app/app/build.gradle so that the custom bootstrap-*.zip files don't get replaced with termux ones.
7. Then build an APK. 

**Note:**
It would be better if you run ./clean.sh before building for a different prefix to start fresh, or pass -f option to build-bootstraps.sh script at least once (for each arch).

If you get curl: (18) transfer closed with x bytes remaining to read. while running build-bootstraps.sh when its downloading a package source, then just run the script again, it should hopefully work.

If you get curl: (22) The requested URL returned error: 410 Gone or something like 404 Not Found while running build-bootstraps.sh when its downloading a package source, then you will have to update the TERMUX_PKG_VERSION, TERMUX_PKG_SRCURL, etc in the build.sh file for the respective package, and fix any *.patch files or apply additional ones if compilation fails, or open an issue in termux-packages.


**Important Notice:**
Please note that current effort will be towards making a nice Renter UI and some issues with the host node could appear and won't be prioritized for fixing or developing additional features.

