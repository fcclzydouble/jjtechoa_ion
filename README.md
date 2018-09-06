打包

1)编译 
    运行命令行：编译生成apk文件

    a) 发布版，需要签名（要使用jarsigner签名必须用release版本
    ionic cordova build android --release 

    b) 优化启动速度，解决启动白屏
    ionic cordova build android --release --prod

2）使用keytool生成keystore文件 
    keytool是JDK自带的加密工具，我们需要生成一个keystore文件，然后保存好，
    之后不需要每次都生成新的。 运行命令行：
    keytool -genkey -v -keystore my-release-key.keystore -alias jjtechoa -keyalg RSA -keysize 2048 -validity 10000

    之后会让我们设置一些密码和安全问题，根据命令行提示进行设置即可，
    最后会在当前命令行执行的目录下自动生成默认名为my-release-key.keystore文件。
     CN=jjtech, OU=jjtech, O=jjtech, L=gz, ST=gd, C=zh
    如果你设置了alias_name，那么文件就是你设置的名字。validity 10000代表文件的加密时间为10000天。

3）使用jarsigner签名 
    jarsigner是JDK自带的签名工具，我们需要将release版本的apk文件利用keystore文件进行加密，
    也就是签名，签名之后的apk才能发布到Android应用市场。 运行命令行：
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore -storepass 123456 -signedjar D:/apk_dev/jjtechoa_ion/platforms/android/app/build/outputs/apk/release/app-release-signed.apk D:/apk_dev/jjtechoa_ion/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk jjtechoa
    

    注意这里的apk路径要正确，如果路径不正确，就找不到需要签名的apk文件，自然会签名失败。

4）压缩apk文件 
    zipalign是Android/sdk/build-tools/VERSION/zipalign的压缩代码工具，可以将我们的apk体积最小化。 
    比如我的zipalign的位置在D:\Android\android-sdk-windows\build tools\25.0.1\zipalign.exe，
    25.0.1是android sdk版本号，任意版本号都有zipalign.exe。 打开电脑的命令行工具：
    zipalign -v 4 D:/apk_dev/jjtechoa_ion/platforms/android/app/build/outputs/apk/release/app-release-signed.apk  D:/apk_dev/jjtechoa_ion/platforms/android/app/build/outputs/apk/release/jjtechoa.apk
    
    这里android-release-unsigned.apk的路径应该是你的正确的路径，
    alias_name是压缩完成之后的apk文件名，成功之后会出现Verification succesful。

5）不需要像苹果一样设置各种各样的证书，现在就可以将我们压缩完成的apk文件上传到相应的应用市场，
    填写相应的APP信息，等待审核就可以了。

saas 安装
npm i -g node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
