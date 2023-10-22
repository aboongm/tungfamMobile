# tungfam

1. Create an APK Set:
	java -jar bundletool.jar build-apks --bundle=app-release.aab --output=app-release.apks --mode=universal --ks=my-upload-key.keystore --ks-pass=pass:password --ks-key-alias=my-key-alias


2. Install APKs on a Device:
	java -jar bundletool.jar install-apks --apks=app-release.apks

3. react native vector icons selector
	https://oblador.github.io/react-native-vector-icons/