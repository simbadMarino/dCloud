# dCloud

Brought to you by [cctechmx](https://www.cctechmx.org)

“Secure, seamless, fully decentralized”

Project goal: Bring decentralized cloud storage (BTFS) to the masses by creating intuitive and Open Source apps for mobile, desktop and web

dCloud short/medium term roadmap in 2022:

- Introduce an intuitive and portable way of uploading files to BTFS (iOS + Android). --> Done
- Bring mobile apps to Google Play and App Store --> Done (Open Test)
- Bring dCloud to desktop environments (macOS and Windows) --> Partially done, Windows still pending

dCloud is basically an Integration of a [BTFS shared library](https://github.com/simbadMarino/btfs-sharedLib) + React Native/Expo GUI.

**Getting started**

Currently dCloud is only available for the following platforms:

- Android
- iOS (Iphone, macOS, iPAD)
- Windows (experimental)

Build & Run sequences in development environments:

**ANDROID**

Note: Due to a [long unsolved issue with go net](https://github.com/golang/go/issues/40569#issuecomment-1907675841) we need to perform additional steps to build jniLibs for Android. Before proceeding with dCloud build you need to do the following:

1. Download applicable go source code from: https://go.dev/dl/
2. Replace the following files:

   interface_linux.go: [http://gateway.btfs.io/btfs/QmUv5nBEvJ44UYUpsGmhXeuHDhUBUnNQefNLuUvTamgnCa](http://gateway.btfs.io/btfs/QmUv5nBEvJ44UYUpsGmhXeuHDhUBUnNQefNLuUvTamgnCa)

   netlink_llinux.go: [http://gateway.btfs.io/btfs/QmVJpjBdFn4NPnjwEhPLVy8LaKuHTtA9FNgumYLJRBU22m](http://gateway.btfs.io/btfs/QmVJpjBdFn4NPnjwEhPLVy8LaKuHTtA9FNgumYLJRBU22m)

   into the go/src directory
3. Compile golang distribution by entering src folder and sending `./all.bash` in a terminal.
4. Update GOROOT envvar by sending: `export GOROOT=/path/to/your/modified/go/folder` (e.g. `export GOROOT=/Users/user1/Documents/go`)
5. Compile btfs-shared-library as usual.

Now building dCloud project:

1. `git clone` dCloud repository
2. Using your favorite terminal go to dcloud project root folder and perform  `yarn install`. This will download and install all reac-native requirements in the "node modules" folder
3. Open dCloud project ("android" folder inside dCloud root folder) in Android Studio.
4. Copy the JNI folder you already created using the btfs-shared-library repo into android/app/src/main folder
5. Build Solution. This will configure your Android project and download all dependencies
6. Run either on simulator or physical device

**iOS**

1. `git clone` dCloud repository
2. Using your favorite terminal go to dcloud project root folder and perform  `yarn install`. This will download and install all reac-native requirements in the "node modules" folder
3. Run `pod install` under the "ios" folder.
4. Open dCloud project ("ios" folder inside dCloud root folder) in XCode.
5. Copy the btfs.a and btfs.h library and header files (obtained from btfs-shared-library repo) into your Xcode project using drag and drop function (you have to create such libs using btfs-shared-library repo)
6. Build Solution. This will configure your iOS project and download all dependencies
7. Run in a physical environment (currently emulators haven't been tested)

**WINDOWS**

1. Install requirements as per https://microsoft.github.io/react-native-windows/docs/rnw-dependencies
2. `git clone` dCloud repository
3. Using your favorite terminal go to dcloud project root folder and perform  `yarn install`. This will download and install all reac-native requirements in the "node modules" folder
4. `npx react-native-windows-init --overwrite`
5. `npx react-native run-windows`

**React Native configuration:**
"react": "18.2.0",
"react-native": "0.72.7",

"expo": "49.0.0"

these versions were tested and currently working, any other version might have some unknown issues

**b) USING A RELEASE FROM GITHUB**

APKs for Android are available for each release.

Google Play : https://play.google.com/store/apps/details?id=com.justshare

iOS TestFlight: https://testflight.apple.com/join/kugM5YlC


If you are looking for some video tutorials please follow us on our Youtube channel:

https://www.youtube.com/channel/UC2Wgz3cwS2RtZzT71pPvwlw

Or contact us trough X: 

[@dCloudStorage](https://twitter.com/dCloudStorage)


## CODE CONTRIBUTORS NOTES

**Important Notice:**

Pull Requests are welcome! , fork this repo, make your updates, push them into your repo and create pull request :)

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
