 jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/projects/memos/keys/android.keystore ~/projects/memos/platforms/android/app/build/outputs/bundle/release/app-release.aab android-app-key
 cp ~/projects/memos/platforms/android/app/build/outputs/bundle/release/app-release.aab ~/Downloads/apps
