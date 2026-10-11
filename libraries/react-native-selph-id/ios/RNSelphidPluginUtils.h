@interface RNSelphidPluginUtils : NSObject
    +(NSString*) getBase64FromUIImage:(UIImage*)thisImage compressFormat:(NSString*)compressFormat imageQuality:(int) imageQuality;
    +(UIImage *)readImage:(NSString *)filename;
    +(UIImage *)readImageBase64:(NSString *)base64Image;
    +(NSString*)base64forData:(NSData*)theData;
    +(UIImage *)scaleAndRotateImage:(UIImage *)image;
@end
