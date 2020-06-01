#/bin/bash
adb logcat | grep -F "`adb shell ps | grep uk.org.okonetwork.parkplanr | tr -s [:space:] ' ' | cut -d' ' -f2`"

