#!/bin/sh

set -xv

native_host="org-capture-native-messaging-host.py"
prefix=${1:-/usr/local/bin}
manifest_basename=io.github.sprig.org_capture_extension.json
case $(uname -s) in
Darwin)
    native_host_system_wide_prefix=/Library/Google/Chrome/NativeMessagingHosts
    ;;
Linux)
    native_host_system_wide_prefix=/etc/opt/chrome/native-messaging-hosts
    ;;
*)
    echo "Unsupported operating system" $(uname -s) 1>&2
    exit 1
    ;;
esac
native_host_prefix=${2:-$native_host_system_wide_prefix}

< "$manifest_basename" sed \
    's!^ *"path":.*!  "path": "'"${prefix}/${native_host}"'",!' \
    > "${native_host_prefix}/${manifest_basename}"
install "$native_host" "${prefix}/${native_host}"
