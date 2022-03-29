#Made for easy access to built apk file with LAN

cordova build
cd platforms/android/app/build/outputs/apk/debug
mv app-debug.apk $1
http-server
