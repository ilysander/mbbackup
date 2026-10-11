  cd ..
  cd android
  echo "--------------------------------------------"
  echo "--- Gradlew clean ---"
  echo "--------------------------------------------"
  ./gradlew clean
  cd ..
  echo "--------------------------------------------"
  echo "--- Generate bundle android if not exist ---"
  echo "--------------------------------------------"
  [ -f android/app/src/main/assets/index.android.bundle ] && echo "bundle android exist" || react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
  cd android/app/src/main/res
  sleep 1
  echo "--------------------------------------------"
  echo "--- For Removing extra folders generated ---"
  echo "--------------------------------------------"
  echo "rm -rf drawable-hdpi drawable-mdpi drawable-xhdpi drawable-xxhdpi drawable-xxxhdpi raw"
  echo "--------------------------------------------"