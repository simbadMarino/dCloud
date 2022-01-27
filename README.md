# dCloud
dCloud is a Full node app for descentralized storage solution

The starting goal of dCloud is to create a seamless and masses ready app for Descentralized Cloud Storage(DCS) solutions. As a starting point and due to the possibility of having a light Full Node BTFS was picked up as the dCloud DCS.

dCloud is basically an Integration of [Termux](https://github.com/termux) + BTFS DCS + React Native GUI. dCloud propposed architecture is shown below:

[dCloud BTFS](https://user-images.githubusercontent.com/11146636/121807867-97ece480-cc1b-11eb-9bcf-f97be0c34b21.png)


**Getting started**

Currently dCloud is only available for Android due to limitations on how iOS manages binary files, however further investigation/implementation is planned to release an iOS version.

As a Google Play / F-Droid version is not ready yet you will need to install dCloud using 

**a) Compiling from Android Studio by cloning this repo and performing the following actions:**

  1. Perform a `yarn install` in the dCloud root folder to install ALL react-native dependencies ( "react": "16.13.1","react-native": "0.63.4" versions were tested and currently working, any other version might have some unknown issues)
  2. Open the android project using Android Studio and select updatedDebug or updatedRelease![image](https://user-images.githubusercontent.com/11146636/137638913-77649e84-cfca-4cd0-aa4a-214ac6114263.png)

  3. Perform a "make project" to verify all dependencies are available and configured. 
  4. Run or create the APK and test either on your phone or emulator
  5. Enjoy :)

**ReactNative assets update for release bundles:**

Assets:

If you are contributing on the Reac-Native UI please make sure all your assets (pictures, gifs, etc) are located at ~root/assets folder before building the release APK


Bootstrap Packages: 

  If bootstrap installation keeps failing with "not executable : `32-bit ELF file` or similar errors in terminal tab please try installing the specific APK per architecture or comment non applicable bootstrap packages from `termux-bootstrap-zip.S` file if you are installing from source code.*
  
dCloud Terminal:

  *If the dCloud terminal is not loaded properly it might be related to jniLibs not properly installed, make sure you don't have an ABI filer activated in the abi filter:* https://github.com/simbadMarino/dCloud/blob/a975e0d35f2830ccad5c73fcf878bf164cfb46c1/android/app/build.gradle#L187

**b) USING A RELEASE FROM GITHUB**

  Please refer to the Releases section (https://github.com/simbadMarino/dCloud/releases) to get the latest APK file format, please note this is a "FAT" installer because it contains all architectures support as well as BTFS1 and BTFS2 binaries which consumes a large percentage of the overall app size. 
            
**BTFS 1:**
Once the installation is successful you need to perform the following. Open the terminal GUI and initialize the btfs services by sending the following commands:

  1. `btfs init`
  3. `btfs daemon`
  4. Go back to dCloud Main Screen by pushing the "Back" button on your phone and select the Settings tab.
  5. Set a password as observed in the animation below to configure the deposits to In-App balance & token transfers.
  6. Close and Open the main dCloud Screen to make sure all screens refresh data coming from the BTFS1 backend app. (This step won't be needed in future improved UI releases)

Steps to storage files on BTFS1 :

In order to upload files to BTFS1 you need to transfer OLDBTT tokens to your TRON Wallet Address first, make sure to have some OLDBTT available in another wallet.
  

  1. 
  3. `btfs daemon`



Note: Currently only BTFS 1 is able to interact with the storage User Interface, BTFS2 is not yet integrated, if you want to experiment with BTFS2 make sure to BACKUP your Mnemonic/Private Key and CIDs of your already uploaded files. If something goes wrong the dCloud team will not be able to retrieve your private key/mnemonic neither your uploaded files.

Optionally, if you already have a private key with some BTT do the following instead:

  1. `btfs init -i "PASTE_YOUR_PRIVATE_KEY_HERE"`
  2. `btfs wallet password "YOUR_PASSWORD_HERE_NO_SPECIAL_CHARACTERS_ALLOWED"`
  3. `btfs daemon`


After this please restart your dCloud app and the GUI should show you the Host UI and your current balance in the Renter tab. From here you can use your app as a full BTFS node.

**HOW TO BUILD CUSTOM BOOTSTRAP PACKAGE FOR ANDROID 10 (EXPERIMENTAL procedure credit goes to: agnostic-apollo from Termux)**

This method is currently under experimental usage, there is not guarantee this will work forever.

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


**DONATIONS**

Why should you donate to dCLoud?

More donation = more money

More money allows me buy more coffee

More coffee makes me write more code

More code means more features

More features make you more productive

More productive so you earn more money

More money you earn more donation to me

More Muhahaha… 


TRON Address: TXQJCQnUNW73vzd4koeZKdzChfKWv8J9G5

![image](https://user-images.githubusercontent.com/11146636/144756464-e08f0037-0745-4c98-8836-e6347db6314c.png)



(Funny donation notes credits: notepad++ devs)
