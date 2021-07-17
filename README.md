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
  2. Open the android project using 

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



**Important Notice:**
Please note that current effort will be towards making a nice Renter UI and some issues with the host node could appear and won't be prioritized for fixing or developing additional features.

