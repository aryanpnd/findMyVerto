# To debug the build app 
- Connect your phone with USB and open the USB debugging, then open the app.
- Open the powershell and run this `
adb logcat *:S ReactNative:V ReactNativeJS:V
`
- Make sure adb is installed in the system enviroment else open the folder where adb is located.

# Invariant violation error
- check out this thread
`
https://www.reddit.com/r/reactnative/comments/14cdq73/i_get_this_error_invariant_violation/
`