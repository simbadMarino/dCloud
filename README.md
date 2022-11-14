# dCloud 
Brought to you by [cctechmx](https://www.cctechmx.org)

“Secure, seamless, fully decentralized”

Project goal: Bring decentralized cloud storage (BTFS) to the masses by creating intuitive and Open Source apps for mobile, desktop and web

dCloud short/medium term roadmap in 2022:
- Introduce an intuitive and portable way of uploading files to BTFS (iOS + Android).
- Bring mobile apps to Google Play and App Store
- Bring dCloud to desktop environments (macOS and Windows)


dCloud is basically an Integration of a [BTFS shared library](https://github.com/simbadMarino/btfs-sharedLib) + React Native/Expo GUI. 



**Getting started**


Currently dCloud is only available for the following platforms:

  - Android 
  - iOS (Iphone, macOS, iPAD)
  - windows (experimental)


Build & Run sequences in development environments:

**ANDROID**

1. `git clone` dCloud repository
2. Using your favorite terminal go to dcloud project root folder and perform  `yarn install`. This will download and install all reac-native requirements in the "node modules" folder
3. Open dCloud project ("android" folder inside dCloud root folder) in Android Studio.
4. Copy the JNI folder you already created using the btfs-shared-library repo
5. Build Solution. This will configure your Android project and download all dependencies
6. Run

**iOS**

1. `git clone` dCloud repository
2. Using your favorite terminal go to dcloud project root folder and perform  `yarn install`. This will download and install all reac-native requirements in the "node modules" folder
3. Run `pod install` under the "ios" folder.
3. Open dCloud project ("ios" folder inside dCloud root folder) in XCode.
4. Copy the btfs.a and btfs.h library and header files into your Xcode project using drag and drop function (you have to create such libs using btfs-shared-library repo)
5. Build Solution. This will configure your iOS project and download all dependencies
6. Run in a physical environment (currently emulators haven't been tested)

**WINDOWS**
1. Install requirements as per https://microsoft.github.io/react-native-windows/docs/rnw-dependencies
2. `git clone` dCloud repository
3. Using your favorite terminal go to dcloud project root folder and perform  `yarn install`. This will download and install all reac-native requirements in the "node modules" folder
4. `npx react-native-windows-init --overwrite`
5. `npx react-native run-windows`

React Native configuration:
 "react": "16.13.1" OR "17.0.2",
 "react-native": "0.63.4" OR "0.67.1" 
 these versions were tested and currently working, any other version might have some unknown issues


**b) USING A RELEASE FROM GITHUB**

  Please refer to the Releases section (https://github.com/simbadMarino/dCloud/releases) to get the latest APK file format, please note this is a "FAT" installer because it contains all architectures(i686,x86_64,aarch64,arm) BTFS binaries which consumes a large percentage of the overall app size. 
       

 Note 1:  Follow the official guidelines (https://docs.btfs.io/v2.0/docs/introduction-setup20) to explore the use cases of BTFS 2.1 in your mobile device.

If you are looking for some video tutorials please take a look at the following videos from our Youtube channel:


https://www.youtube.com/watch?v=y_hqOV1IySw&t=130s

https://www.youtube.com/watch?v=kNigl3dMPaM&t=254s



## CODE CONTRIBUTORS NOTES

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

<a href="https://trxdomains.xyz/" target="_blank">
<img src="https://trxdomains.xyz/logo/logo_cic.png?v=3" width="100" height="100">
</a>




