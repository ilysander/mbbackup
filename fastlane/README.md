fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### publish_draft_appgallery

```sh
[bundle exec] fastlane publish_draft_appgallery
```



### publish_appgallery

```sh
[bundle exec] fastlane publish_appgallery
```



----


## iOS

### ios typescript

```sh
[bundle exec] fastlane ios typescript
```

Typescript

### ios jscrambler

```sh
[bundle exec] fastlane ios jscrambler
```

Download last source maps from jscrambler

### ios build_dev

```sh
[bundle exec] fastlane ios build_dev
```

Build DEV IPA

### ios build_demo

```sh
[bundle exec] fastlane ios build_demo
```

Build Demo IPA

### ios build_qa

```sh
[bundle exec] fastlane ios build_qa
```

Build QA IPA

### ios ofuscated_ixguard_qa

```sh
[bundle exec] fastlane ios ofuscated_ixguard_qa
```

Local Only Ofuscate ixguard IPA

### ios build_automation

```sh
[bundle exec] fastlane ios build_automation
```

Build Automation IPA

### ios build_release

```sh
[bundle exec] fastlane ios build_release
```

Build Release IPA

### ios build_demo_appcenter

```sh
[bundle exec] fastlane ios build_demo_appcenter
```

Build/Upload Demo IPA - APP Center

### ios build_qa_appcenter

```sh
[bundle exec] fastlane ios build_qa_appcenter
```

Build and Upload QA IPA - App Center

----


## Android

### android typescript

```sh
[bundle exec] fastlane android typescript
```

Typescript

### android jscrambler

```sh
[bundle exec] fastlane android jscrambler
```

Download last source maps from jscrambler

### android build_dev

```sh
[bundle exec] fastlane android build_dev
```

Build DEV APK

### android build_demo

```sh
[bundle exec] fastlane android build_demo
```

Build Demo APK

### android build_qa_apk

```sh
[bundle exec] fastlane android build_qa_apk
```

Build QA APK

### android build_qa

```sh
[bundle exec] fastlane android build_qa
```

Build QA Bundle

### android build_automation

```sh
[bundle exec] fastlane android build_automation
```

Build Automation APK

### android build_release

```sh
[bundle exec] fastlane android build_release
```

Build Release Bundle

### android build_release_qa

```sh
[bundle exec] fastlane android build_release_qa
```

Build Release QA APK

### android build_upload_demo_appcenter

```sh
[bundle exec] fastlane android build_upload_demo_appcenter
```

Build and Upload Demo APK - App Center

### android build_upload_qa_appcenter

```sh
[bundle exec] fastlane android build_upload_qa_appcenter
```

Build and Upload QA APK - App Center

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
