# dCloud 
Brought to you by [cctechmx](https://www.cctechmx.org)

dCloud is a Web3 Cloud Storage Mobile App

dCloud short/medium term goals in 2022:
- Introduce an intuitive and portable way of uploading files to BTFS (iOS + Android).
- Bring mobile apps to Google Play and App Store
- Bring dCloud to desktop environments (macOS and Windows)

The  goal of dCloud is to create a seamless and masses ready app for Descentralized Cloud Storage(DCS) powered by [BTFS](https://github.com/bittorrent/go-btfs).

dCloud is basically an Integration of a [BTFS shared library](https://github.com/simbadMarino/btfs-sharedLib) + React Native/Expo GUI. 



**Getting started**


Currently dCloud is only available for the following platforms:

  - Android 
  - iOS
  - macOS (experimental)

## EVERYTHING BEYOND this line is under update, please ignore until further notice!!
<a href="" target="_blank">
<img src="https://thumbs.dreamstime.com/z/thin-line-style-under-maintenance-message-banner-100071034.jpg" width="600" height="350">
</a>

As a Google Play / F-Droid version is not ready yet you will need to install dCloud using 

**a) Compiling from Android Studio by cloning this repo and performing the following actions:**

  1. Perform a `yarn install` in the dCloud root folder to install ALL react-native dependencies ( "react": "16.13.1" OR "17.0.2","react-native": "0.63.4" OR "0.67.1" versions were tested and currently working, any other version might have some unknown issues)
  2. Open the android project using Android Studio and select updatedDebug or updatedRelease![image](https://user-images.githubusercontent.com/11146636/137638913-77649e84-cfca-4cd0-aa4a-214ac6114263.png)

  3. Perform a "make project" to verify all dependencies are available and configured. 
  4. Run or create the APK and test either on your phone or emulator
  5. Enjoy :)

**b) USING A RELEASE FROM GITHUB**

  Please refer to the Releases section (https://github.com/simbadMarino/dCloud/releases) to get the latest APK file format, please note this is a "FAT" installer because it contains all architectures(i686,x86_64,aarch64,arm) BTFS binaries which consumes a large percentage of the overall app size. 
       

Steps to use use BTFS in dCloud:

WARNING: If something goes wrong the dCloud team will not be able to retrieve your private key/mnemonic neither your uploaded files. 

  1. Open the terminal window within dCloud
  2. Run the following commands 
  3. `btfs init` 
  4. `btfs config profile apply storage-host`
  5. `btfs daemon --chain-id 199`
  6. Copy your BTTC Address
  7. Fill your BTFS Wallet with BTT
  8. Once your node detects enough balance is available in your wallet it will start daemon.
  9. Get WBTT into your wallet by using the already available SWAP service in the app Wallet section. Or if you want to manage your BTT wallet using metamask send the desired amount of BTT to the following contract address: `0x23181F21DEa5936e24163FFABa4Ea3B316B57f3C` (Only used for renting purposes)
  
 Note 1:  Follow the official guidelines (https://docs.btfs.io/v2.0/docs/introduction-setup20) to explore the use cases of BTFS 2.1 in your mobile device.

If you are looking for some video tutorials please take a look at the following videos from our Youtube channel:


https://www.youtube.com/watch?v=y_hqOV1IySw&t=130s

https://www.youtube.com/watch?v=kNigl3dMPaM&t=254s





## CODE CONTRIBUTORS NOTES


**REACTNATIVE ASSETS UPDATE FOR RELEASE BUNDLES:**

Assets:

If you are contributing on the Reac-Native UI please make sure all your assets (pictures, gifs, etc) are located at ~root/assets folder before building the release APK


Bootstrap Packages: 

  If bootstrap installation keeps failing with "not executable : `32-bit ELF file` or similar errors in terminal tab please try installing the specific APK per architecture or comment non applicable bootstrap packages from `termux-bootstrap-zip.S` file if you are installing from source code.*
  
dCloud Terminal:

  *If the dCloud terminal is not loaded properly it might be related to jniLibs not properly installed, make sure you don't have an ABI filer activated in the abi filter:* https://github.com/simbadMarino/dCloud/blob/a975e0d35f2830ccad5c73fcf878bf164cfb46c1/android/app/build.gradle#L187




**HOW TO BUILD CUSTOM BOOTSTRAP PACKAGE FOR ANDROID 10 (EXPERIMENTAL procedure credit goes to: agnostic-apollo from Termux)**

This method is currently under experimental usage, there is not guarantee this will work forever.

`build-bootstraps.sh` script locally cross-compile the bootstrap package debs and create bootstrap zips. It is working for a different PREFIX to be ported to the official termux app without reworing termux code.  On-device (termux in mobile) builds are not supported currently, so use PC (cross-compile in docker).

Firstly, you need to pull the latest changes from [termux-packages](https://github.com/termux/termux-packages) repo.

Then

1. Set the TERMUX_APP_PACKAGE value in properties.sh to your app's package name ("com.justshare" for dCloud).
2. Place the [build-bootstraps.zip](https://github.com/simbadMarino/dCloud/files/7174712/build-bootstraps.zip)
 in termux-packages/scripts directory.
3. Run cd termux-packages
4. Run ./scripts/run-docker.sh ./scripts/build-bootstraps.sh --android10 -f -a btfs,btfs2 &> build.log to compile for all archs. You should find the bootstrap-*.zip in the termux-packages directory. If you want to compile only for a specific arch like aarch64, then run ./scripts/run-docker.sh ./scripts/build-bootstraps.sh --android10 --architectures aarch64 -f -a btfs,btfs2 &> build.log. 
5. Replace/place the zips in termux-app/app/src/main/cpp and make sure BTFS bootstrap release packages URLs are updated in the source code: https://github.com/simbadMarino/dCloud/blob/cb07da42d25afe7e2120c6ca10bb0be6d327797e/android/app/build.gradle#L397 as well as their sha256 checksums at: https://github.com/simbadMarino/dCloud/blob/cb07da42d25afe7e2120c6ca10bb0be6d327797e/android/app/build.gradle#L430
6. Then build an APK. 

**Note:**

If you get curl: (18) transfer closed with x bytes remaining to read. while running build-bootstraps.sh when its downloading a package source, then just run the script again, it should hopefully work.

If you get curl: (22) The requested URL returned error: 410 Gone or something like 404 Not Found while running build-bootstraps.sh when its downloading a package source, then you will have to update the TERMUX_PKG_VERSION, TERMUX_PKG_SRCURL, etc in the build.sh file for the respective package, and fix any *.patch files or apply additional ones if compilation fails, or open an issue in termux-packages.


**Important Notice:**
Please note that current effort will be towards making a nice Renter UI and some issues with the host node could appear and won't be prioritized for fixing or developing additional features.


## Donations

dCloud is currently mantained by volunteers, a couple of crypto to buy some coffe is well received =)


TRON Address: TXQJCQnUNW73vzd4koeZKdzChfKWv8J9G5

<img src="https://user-images.githubusercontent.com/11146636/144756464-e08f0037-0745-4c98-8836-e6347db6314c.png" width="150" height="150">




## Strategic Partners

<a href="https://kraftly.io" target="_blank">
<img src="https://user-images.githubusercontent.com/11146636/157590553-afdb4507-65a1-4336-820a-ad9f024d42c5.png" width="100" height="100">
</a>
