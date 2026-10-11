
#import "RNSelphiFacePluginModule.h"
#import <UIKit/UIKit.h>

// import RCTBridge
#if __has_include(<React/RCTBridge.h>)
#import <React/RCTBridge.h>
#elif __has_include(“RCTBridge.h”)
#import “RCTBridge.h”
#else
#import “React/RCTBridge.h” // Required when used as a Pod in a Swift project
#endif

@interface RNSelphiFacePluginModule ()
@end

@implementation RNSelphiFacePluginModule

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onSelphiLogEvent", @"onSelphiLogQREvent"];
}

RCT_EXPORT_MODULE(RNSelphiFacePluginModule);

RCT_EXPORT_METHOD(qrValid)
{
    @try {
        self.isQRValid = true;
        self.enableWidgetEventQRListener = false;
    } @catch (NSError *e) {
        _reject(@"Exception", @"Exception", e);
    }
}

RCT_EXPORT_METHOD(startExtraction: (NSString *)resourcesPath
                  configuration:(NSDictionary*)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        _resolve = resolve;
        _reject = reject;
        
        NSError *error = nil;
        NSBundle *bundle = [NSBundle bundleForClass:[RNSelphiFacePluginModule class]];
        NSString *strBundle = [bundle pathForResource:resourcesPath ofType:@"zip"];
        
        if (config != nil) {
            NSObject *enableGenerateTemplateRaw = [config objectForKey:@"enableGenerateTemplateRaw"];
            if (enableGenerateTemplateRaw != nil)
                self.enableGenerateTemplateRaw = ((NSNumber *)enableGenerateTemplateRaw).boolValue;
            
            NSObject *isCameraFrontalPreferred = [config objectForKey:@"frontalCameraPreferred"];
            if (isCameraFrontalPreferred != nil)
                _uc = [[SelphiWidget alloc]initWithFrontCameraIfAvailable :((NSNumber *)isCameraFrontalPreferred).boolValue
                                                                 resources: strBundle
                                                                  delegate:self
                                                                     error:&error];
            else
                _uc = [[SelphiWidget alloc]initWithFrontCameraIfAvailable :true
                                                                 resources: strBundle
                                                                  delegate:self
                                                                     error:&error];
        } else {
            _uc = [[SelphiWidget alloc]initWithFrontCameraIfAvailable :true
                                                             resources:strBundle
                                                              delegate:self
                                                                 error:&error];
        }
        
        if (error != nil) {
            switch (error.code) {
                case FWECameraPermission:
                {
                    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
                    [dict setObject:[NSNumber numberWithInt:2] forKey:@"finishStatus"];
                    [dict setObject:[NSNumber numberWithInt:3] forKey:@"errorType"];
                    _reject(@"PERMISSION ERROR",
                            @"Permission error during proccess.",
                            error);
                    return;
                }
                default:
                {
                    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
                    [dict setObject:[NSNumber numberWithInt:2] forKey:@"finishStatus"];
                    [dict setObject:[NSNumber numberWithInt:1] forKey:@"errorType"];
                    _reject(@"GENERIC ERROR",
                            @"Error during bundle resources loading.",
                            error);
                    return;
                }
            }
        }
        // Analyze configuration properties
        if (config != nil) {
            NSObject *debug = [config objectForKey:@"debug"];
            if (debug != nil)
                _uc.debugMode = ((NSNumber *)debug).boolValue;
            
            NSObject *tutorial = [config objectForKey:@"tutorial"];
            if (tutorial != nil)
                _uc.tutorialFlag = ((NSNumber *)tutorial).boolValue;
            
            NSObject *showResultAfterCapture = [config objectForKey:@"showResultAfterCapture"];
            if (showResultAfterCapture != nil)
                _uc.showAfterCapture = ((NSNumber *)showResultAfterCapture).boolValue;
            
            NSObject *qrMode = [config objectForKey:@"qrMode"];
            if (qrMode != nil) {
                self.uc.qrMode = ((NSNumber *)qrMode).boolValue;
                self.enableWidgetEventQRListener = ((NSNumber *)qrMode).boolValue;
                self.isQRValid = false;
            }
            
            NSObject *crop = [config objectForKey:@"crop"];
            if (crop != nil)
                self.uc.cropImagesToFace = ((NSNumber *)crop).boolValue;
            
            NSObject *cropRatio = [config objectForKey:@"cropPercent"];
            if (cropRatio != nil)
                self.uc.cropRatio = ((NSNumber *)cropRatio).floatValue;
            
            NSObject *stabilizationMode = [config objectForKey:@"stabilizationMode"];
            if (stabilizationMode != nil)
                self.uc.stabilizationMode = ((NSNumber *)stabilizationMode).boolValue;
            
            NSObject *templateRawOptimized = [config objectForKey:@"templateRawOptimized"];
            if (templateRawOptimized != nil)
                self.uc.templateRawOptimized = ((NSNumber *)templateRawOptimized).boolValue;
            
            NSObject *jpgQuality = [config objectForKey:@"jpgQuality"];
            if (jpgQuality != nil)
                self.uc.jpgQuality = ((NSNumber *)jpgQuality).floatValue;
            else
                self.uc.jpgQuality = 0.95f;
            
            NSObject *enableImages = [config objectForKey:@"enableImages"];
            if (enableImages != nil) {
                self.uc.logImages = ((NSNumber *)enableImages).boolValue;
                self.enableImages = self.uc.logImages;
            }
            
            NSObject *enableWidgetEventListener = [config objectForKey:@"enableWidgetEventListener"];
            if (enableWidgetEventListener != nil)
                self.enableWidgetEventListener = ((NSNumber *)enableWidgetEventListener).boolValue;
            
            
            NSObject *desiredCameraWidth = [config objectForKey:@"desiredCameraWidth"];
            if (desiredCameraWidth != nil)
                self.uc.desiredCameraWidth = ((NSNumber *)desiredCameraWidth).intValue;
            NSObject *desiredCameraHeight = [config objectForKey:@"desiredCameraHeight"];
            if (desiredCameraHeight != nil)
                self.uc.desiredCameraHeight = ((NSNumber *)desiredCameraHeight).intValue;
            
            NSString *livenessMode = [config objectForKey:@"livenessMode"];
            if (livenessMode != nil && livenessMode != (NSString*)[NSNull null]) {
                if ([livenessMode compare:@"PASSIVE" ] == NSOrderedSame)
                {
                    self.uc.desiredCameraWidth = 1280;
                    self.uc.desiredCameraHeight = 720;
                    self.uc.livenessMode = LMLivenessPassive;
                }
                else
                    self.uc.livenessMode = LMLivenessNone;
            }
            
            NSObject *userTags = [config objectForKey:@"uTags"];
            if (userTags != nil && userTags != (NSString*)[NSNull null]) {
                self.uc.userTags = [[NSData alloc] initWithBase64EncodedString:(NSString *)userTags options:0];
            }
            
            NSObject *locale = [config objectForKey:@"locale"];
            if (locale != nil && locale != (NSString*)[NSNull null])
                self.uc.locale = ((NSString *)locale);
            else
                self.uc.locale = @"";
            
            NSObject *translationsContent = [config objectForKey:@"translationsContent"];
            if (translationsContent != nil && translationsContent != (NSString*)[NSNull null])
                self.uc.translationsContent = ((NSString *)translationsContent);
            
            NSObject *viewsContent = [config objectForKey:@"viewsContent"];
            if (viewsContent != nil && viewsContent != (NSString*)[NSNull null])
                self.uc.viewsContent = ((NSString *)viewsContent);
            
            NSDictionary *params = [config objectForKey:@"params"];
            //NSLog(@"%@", params);
            if (params != nil) {
                for (NSString* key in [params allKeys]) {
                    NSString* value = params[key];
                    [self.uc setParam:key withValue:value];
                }
            }
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            UIViewController *rnViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
            [self->_uc StartExtraction];
            [rnViewController presentViewController:self->_uc animated:true completion:nil];
        });
    } @catch (NSError *e) {
        _reject(@"Exception", @"Exception", e);
    }
    
}

RCT_EXPORT_METHOD(generateTemplateRaw:(NSString *)imageBase64
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        _resolve = resolve;
        _reject = reject;
        
        UIImage* rawImage = [RNSelphiFacePluginModule base64toUIImage:imageBase64];
        NSData *imageTemplate = [FPhiWidget generateTemplateRawFromUIImage:rawImage];
        NSString* imageTemplateBase64 = [RNSelphiFacePluginModule imageToBase64:imageTemplate];
        _resolve(imageTemplateBase64);
    } @catch (NSError *e) {
        _reject(@"Exception", @"Exception", e);
    }
}

RCT_EXPORT_METHOD(getDeviceCameras: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        _resolve = resolve;
        _reject = reject;
        
        NSString *logString = [NSString stringWithFormat:@"{\"cameras\": \"%s\"}", "Method not implemented for iOS Platform"];
        _resolve(logString);
    } @catch (NSError *e) {
        _reject(@"Exception", @"Exception", e);
    }
}

RCT_EXPORT_METHOD(getVersion: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        _resolve = resolve;
        _reject = reject;
        
        NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
        [dict setObject:SelphiWidget.widgetVersion forKey:@"version"];
        
        _resolve(dict);
    } @catch (NSError *e) {
        _reject(@"Exception", @"Exception", e);
    }
}

- (void)ExtractionFinished {
    NSLog(@"startSelphiFaceWidget finished");
    
    NSMutableDictionary *dictResult = [self parseResults:(SelphiWidget *)_uc];
    self.uc = nil;
    _resolve(dictResult);
}

/**
 Invoked when the extraction process fail.
 - Optional method
 */
-(void)ExtractionFailed:(NSError *) error {
    NSLog(@"StartWidget failed");
    self.uc = nil;
    _reject(@"OPERATION MODE ERROR",
            @"Failed process. Unhandled error.",
            error);
}

/**
 Invoked when extraction process is cancelled by user.
 - Optional method
 */
-(void)ExtractionCancelled {
    NSLog(@"StartWidget cancelled");
    
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    [dict setObject:[NSNumber numberWithInt:3] forKey:@"finishStatus"];
    [dict setObject:[NSNumber numberWithInt:2] forKey:@"errorType"];
    [dict setObject:[NSNumber numberWithInt:1] forKey:@"livenessDiagnostic"];
    
    self.uc = nil;
    _resolve(dict);
}

/**
 Invoked when extraction process is aborted by timeout.
 - Optional method
 */
-(void)ExtractionTimeout {
    NSLog(@"StartWidget timeout");
    
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    [dict setObject:[NSNumber numberWithInt:4] forKey:@"finishStatus"];
    [dict setObject:[NSNumber numberWithInt:2] forKey:@"errorType"];
    [dict setObject:[NSNumber numberWithInt:1] forKey:@"livenessDiagnostic"];
    
    self.uc = nil;
    _resolve(dict);
}


-(NSMutableDictionary *) parseResults:(SelphiWidget *)userControl {
    @try {
        NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
        // Generic data
        [dict setObject:[NSNumber numberWithInt:1] forKey:@"finishStatus"];
        [dict setObject:[NSNumber numberWithInt:2] forKey:@"errorType"];
        //[dict setObject:[NSNumber numberWithInt:(int)self.uc.livenessDiagnostic+1] forKey:@"livenessDiagnostic"];
        
        
        NSData *template = [self.uc.results.result getTemplate];
        [dict setObject:[RNSelphiFacePluginModule base64forData:template] forKey:@"template"];
        
        NSData *templateRaw = [self.uc.results.result getTemplateRaw];
        if(templateRaw)
            [dict setObject:[RNSelphiFacePluginModule base64forData:templateRaw] forKey:@"templateRaw"];
        
        [dict setObject:[NSNumber numberWithFloat:self.uc.results.result.templateInfo.eyeGlassesScore] forKey:@"eyeGlassesScore"];
        [dict setObject:[NSNumber numberWithFloat:self.uc.results.result.templateInfo.templateScore] forKey:@"templateScore"];
        
        if (self.uc.results.qrData != nil)
            [dict setObject:self.uc.results.qrData forKey:@"qrData"];
        
        NSMutableArray *images = [NSMutableArray array];
        if (self.enableImages) {
            if (self.uc.results.images != nil) {
                for (int a=0; a<self.uc.results.images.count; a++) {
                    FPhiWidgetExtractionRecord *record = [self.uc.results.images objectAtIndex:a];
                    NSData *data = UIImageJPEGRepresentation(record.image, self.uc.jpgQuality);
                    NSString *base64String = [RNSelphiFacePluginModule base64forData:data];
                    // base64String = [NSString stringWithFormat:@"data:image/jpg;base64,%@",base64String];
                    [images addObject:base64String];
                }
            }
        }
        [dict setObject:images forKey:@"images"];
        
        if (self.uc.results.bestImage != nil) {
            FPhiWidgetExtractionRecord *record = self.uc.results.bestImage;
            NSData *data = UIImageJPEGRepresentation(record.image, self.uc.jpgQuality);
            NSString *base64String = [RNSelphiFacePluginModule base64forData:data];
            [dict setObject:base64String forKey:@"bestImage"];
            
            if (self.enableGenerateTemplateRaw) {
                UIImage* rawImage = [RNSelphiFacePluginModule base64toUIImage:base64String];
                NSData *imageTemplate = [FPhiWidget generateTemplateRawFromUIImage:rawImage];
                self.bestImageTemplateRaw = [RNSelphiFacePluginModule imageToBase64:imageTemplate];
            }
        }
        
        if (self.bestImageTemplateRaw != nil) {
            [dict setObject:self.bestImageTemplateRaw forKey:@"bestImageTemplateRaw"];
        }
        
        if (self.uc.results.bestImageCropped != nil) {
            FPhiWidgetExtractionRecord *record = self.uc.results.bestImageCropped;
            NSData *data = UIImageJPEGRepresentation(record.image, self.uc.jpgQuality);
            NSString *base64String = [RNSelphiFacePluginModule base64forData:data];
            [dict setObject:base64String forKey:@"bestImageCropped"];
        }
        
        self.uc = nil;
        return dict;
    } @catch (NSError *e) {
        _reject(@"Exception", @"Exception", e);
    }
}

-(BOOL)QRValidator:(NSString *)qrData {
    if (self.enableWidgetEventQRListener) {
        NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
        [dict setObject:qrData forKey:@"qrData"];
        
        //NSString *logString = [NSString stringWithFormat:@"{\"qrData\": \"%@\"}", qrData];
        //NSLog(@"%@", logString);
        [self sendEventWithName:@"onSelphiLogQREvent" body: dict];
    }
    
    if (self.isQRValid) {
        return true;
    }
    return false;
}

-(void)onEvent:(NSDate *)time type:(NSString *)type info:(NSString *)info {
    if (self.enableWidgetEventListener) {
        //NSLog(@"onSelphiLogEvent: (%lums) %@ - %@", (unsigned long)(time.timeIntervalSince1970*1000), type, info);
        //NSString* dateString = [NSDateFormatter localizedStringFromDate:[NSDate date] dateStyle:NSDateFormatterShortStyle timeStyle:NSDateFormatterMediumStyle];
        
        NSNumber *timeDouble = [NSNumber numberWithDouble:time.timeIntervalSince1970];
        NSString *timeString = [timeDouble stringValue];
        NSString *logString = [NSString stringWithFormat:@"{\"selphiLogInfo\":{\"time\":\"%@\", \"type\":\"%@\", \"info\":\"%@\"}}", timeString, type, info];
        
        [self sendEventWithName:@"onSelphiLogEvent" body: logString];
    }
}

+ (NSString*)base64forData:(NSData*)theData {
    const uint8_t* input = (const uint8_t*)[theData bytes];
    NSInteger length = [theData length];
    
    static char table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    
    NSMutableData* data = [NSMutableData dataWithLength:((length + 2) / 3) * 4];
    uint8_t* output = (uint8_t*)data.mutableBytes;
    
    NSInteger i;
    for (i=0; i < length; i += 3) {
        NSInteger value = 0;
        NSInteger j;
        for (j = i; j < (i + 3); j++) {
            value <<= 8;
            
            if (j < length) {
                value |= (0xFF & input[j]);
            }
        }
        
        NSInteger theIndex = (i / 3) * 4;
        output[theIndex + 0] =                    table[(value >> 18) & 0x3F];
        output[theIndex + 1] =                    table[(value >> 12) & 0x3F];
        output[theIndex + 2] = (i + 1) < length ? table[(value >> 6)  & 0x3F] : '=';
        output[theIndex + 3] = (i + 2) < length ? table[(value >> 0)  & 0x3F] : '=';
    }
    
    return [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
}


+ (UIImage*)base64toUIImage:(NSString*)imageString {
    NSString* str = [imageString stringByReplacingOccurrencesOfString:@"data:image/png;base64," withString:@""];
    str = [str stringByReplacingOccurrencesOfString:@"data:image/jpeg;base64," withString:@""];
    NSData *data = [[NSData alloc]initWithBase64EncodedString:str options:NSDataBase64DecodingIgnoreUnknownCharacters];
    return [UIImage imageWithData:data];
}

+ (NSString*)imageToBase64:(NSData*)imageData {
    NSString *imageDataBase64 = [[NSString alloc] initWithData:[imageData base64EncodedDataWithOptions:0] encoding:NSASCIIStringEncoding];
    return imageDataBase64;
}

-(UIImage *)scaleAndRotateImage:(UIImage *)image {
    CGImageRef imgRef = image.CGImage;
    
    CGFloat width = CGImageGetWidth(imgRef);
    CGFloat height = CGImageGetHeight(imgRef);
    
    
    CGAffineTransform transform = CGAffineTransformIdentity;
    CGRect bounds = CGRectMake(0, 0, width, height);
    
    CGFloat scaleRatio = bounds.size.width / width;
    CGSize imageSize = CGSizeMake(CGImageGetWidth(imgRef), CGImageGetHeight(imgRef));
    CGFloat boundHeight;
    UIImageOrientation orient = image.imageOrientation;
    switch(orient) {
            
        case UIImageOrientationUp: //EXIF = 1
            transform = CGAffineTransformIdentity;
            break;
            
        case UIImageOrientationUpMirrored: //EXIF = 2
            transform = CGAffineTransformMakeTranslation(imageSize.width, 0.0);
            transform = CGAffineTransformScale(transform, -1.0, 1.0);
            break;
            
        case UIImageOrientationDown: //EXIF = 3
            transform = CGAffineTransformMakeTranslation(imageSize.width, imageSize.height);
            transform = CGAffineTransformRotate(transform, M_PI);
            break;
            
        case UIImageOrientationDownMirrored: //EXIF = 4
            transform = CGAffineTransformMakeTranslation(0.0, imageSize.height);
            transform = CGAffineTransformScale(transform, 1.0, -1.0);
            break;
            
        case UIImageOrientationLeftMirrored: //EXIF = 5
            boundHeight = bounds.size.height;
            bounds.size.height = bounds.size.width;
            bounds.size.width = boundHeight;
            transform = CGAffineTransformMakeTranslation(imageSize.height, imageSize.width);
            transform = CGAffineTransformScale(transform, -1.0, 1.0);
            transform = CGAffineTransformRotate(transform, 3.0 * M_PI / 2.0);
            break;
            
        case UIImageOrientationLeft: //EXIF = 6
            boundHeight = bounds.size.height;
            bounds.size.height = bounds.size.width;
            bounds.size.width = boundHeight;
            transform = CGAffineTransformMakeTranslation(0.0, imageSize.width);
            transform = CGAffineTransformRotate(transform, 3.0 * M_PI / 2.0);
            break;
            
        case UIImageOrientationRightMirrored: //EXIF = 7
            boundHeight = bounds.size.height;
            bounds.size.height = bounds.size.width;
            bounds.size.width = boundHeight;
            transform = CGAffineTransformMakeScale(-1.0, 1.0);
            transform = CGAffineTransformRotate(transform, M_PI / 2.0);
            break;
            
        case UIImageOrientationRight: //EXIF = 8
            boundHeight = bounds.size.height;
            bounds.size.height = bounds.size.width;
            bounds.size.width = boundHeight;
            transform = CGAffineTransformMakeTranslation(imageSize.height, 0.0);
            transform = CGAffineTransformRotate(transform, M_PI / 2.0);
            break;
            
        default:
            [NSException raise:NSInternalInconsistencyException format:@"Invalid image orientation"];
            
    }
    
    UIGraphicsBeginImageContext(bounds.size);
    
    CGContextRef context = UIGraphicsGetCurrentContext();
    
    if (orient == UIImageOrientationRight || orient == UIImageOrientationLeft) {
        CGContextScaleCTM(context, -scaleRatio, scaleRatio);
        CGContextTranslateCTM(context, -height, 0);
    }
    else {
        CGContextScaleCTM(context, scaleRatio, -scaleRatio);
        CGContextTranslateCTM(context, 0, -height);
    }
    
    CGContextConcatCTM(context, transform);
    
    CGContextDrawImage(UIGraphicsGetCurrentContext(), CGRectMake(0, 0, width, height), imgRef);
    UIImage *imageCopy = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return imageCopy;
}

@end
