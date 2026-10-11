#import "RNSelphidPluginModule.h"

@implementation RNSelphidPluginModule

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE(RNSelphidPluginModule);

RCT_EXPORT_METHOD(startCapture:(NSString *)mode
                  resourcePath:(NSString *)resourcesPath
                  license:(NSString*)license
                  ocrPreviousData:(NSString*)previousData
                  configuration:(NSDictionary*)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self LaunchSelphIDWidget: mode
                 resourcePath:resourcesPath
                      license:license
              ocrPreviousData:previousData
                configuration:config
                     resolver:resolve
                     rejecter:reject];
}

RCT_EXPORT_METHOD(startTest:(NSString *)mode
                  resourcePath:(NSString *)resourcesPath
                  license:(NSString*)license
                  ocrPreviousData:(NSString*)previousData
                  configuration:(NSDictionary*)config
                  testImageName: (NSString*) testImageName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    UIImage *testImage = [RNSelphidPluginUtils readImage:testImageName];
    self.testImage = testImage;
    
    [self LaunchSelphIDWidget: mode
                 resourcePath:resourcesPath
                      license:license
              ocrPreviousData:previousData
                configuration:config
                     resolver:resolve
                     rejecter:reject];
}

RCT_EXPORT_METHOD(startTestBase64:(NSString *)mode
                  resourcePath:(NSString *)resourcesPath
                  license:(NSString*)license
                  ocrPreviousData:(NSString*)previousData
                  configuration:(NSDictionary*)config
                  testImageName: (NSString*) testImageName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    UIImage *testImage = [RNSelphidPluginUtils readImageBase64:testImageName];
    self.testImage = testImage;
    
    [self LaunchSelphIDWidget: mode
                 resourcePath:resourcesPath
                      license:license
              ocrPreviousData:previousData
                configuration:config
                     resolver:resolve
                     rejecter:reject];
}

RCT_EXPORT_METHOD(tokenize:(NSString *)data
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try
    {
        NSString *tokenized = [[FPhiSelphIDWidget alloc] tokenize:data];
        //NSLog(@"tokenized : %@\n", tokenized);
        resolve(tokenized);
    }
    @catch (NSError *e) {
        reject(@"Exception", @"Exception", e);
    }
}

RCT_EXPORT_METHOD(getDeviceCameras:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try
    {
        NSString *logString = [NSString stringWithFormat:@"{\"cameras\": \"%s\"}", "Method not implemented for iOS Platform"];
        resolve(logString);
    }
    @catch (NSError *e) {
        reject(@"Exception", @"Exception", e);
    }
}

RCT_EXPORT_METHOD(getVersion:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try
    {
        NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
        [dict setObject:FPhiSelphIDWidget.widgetVersion forKey:@"version"];
        
        resolve(dict);
    }
    @catch (NSError *e) {
        reject(@"Exception", @"Exception", e);
    }
}

-(void)LaunchSelphIDWidget: (NSString *)mode
              resourcePath:(NSString *)resourcesPath
                   license:(NSString*)license
           ocrPreviousData:(NSString*)previousData
             configuration:(NSDictionary*)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject {
    @try {
        _resolve = resolve;
        _reject = reject;
        
        NSError *error = nil;
        NSBundle *bundle = [NSBundle bundleForClass:[RNSelphidPluginConfiguration class]];
        NSString *strBundle = [bundle pathForResource:resourcesPath ofType:@"zip"];
        
        self.widget = [[FPhiSelphIDWidget alloc]initWithBackCameraIfAvailable :true
                                                                      resources:strBundle
                                                                       delegate:self
                                                                        license:license
                                                                          error:&error];
        if (config != nil) {
            NSObject *enableWidgetEventListener = [config objectForKey:@"enableWidgetEventListener"];
            if (enableWidgetEventListener != nil)
                self.enableWidgetEventListener = ((NSNumber *)enableWidgetEventListener).boolValue;
            
            self.compressFormat = @"jpeg";
            NSObject *compressFormat = [config objectForKey:@"compressFormat"];
            if (compressFormat != nil) {
                self.compressFormat = ((NSString *)compressFormat);
            }
            
            self.imageQuality = 90;
            NSObject *imageQuality = [config objectForKey:@"imageQuality"];
            if (imageQuality != nil) {
                NSString *intString = ((NSString *)imageQuality);
                self.imageQuality = [intString intValue];

                if (self.imageQuality > 0 && self.imageQuality < 90) {
                    //self.imageQuality = 90;
                    NSLog(@"Warning: imageQuality selection not recommended");
                }
                if (self.imageQuality < 0 || self.imageQuality > 100) {
                    self.imageQuality = 90;
                }
            }
        }
        
        if (error != nil) {
            switch (error.code) {
                case FWMECameraPermission:
                {
                    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
                    [dict setObject:[NSNumber numberWithInt:2] forKey:@"finishStatus"];
                    [dict setObject:[NSNumber numberWithInt:3] forKey:@"errorType"];
                    [dict setObject:[NSNumber numberWithInt:self.widget.results.captureProgress] forKey:@"timeoutStatus"];
                    [NSException raise:@"PERMISSION ERROR" format:@"Permission error during proccess."];
                    return;
                }
                default:
                {
                    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
                    [dict setObject:[NSNumber numberWithInt:2] forKey:@"finishStatus"];
                    [dict setObject:[NSNumber numberWithInt:1] forKey:@"errorType"];
                    [dict setObject:[NSNumber numberWithInt:self.widget.results.captureProgress] forKey:@"timeoutStatus"];
                    
                    [NSException raise:@"GENERIC ERROR" format:@"Error during bundle resources loading."];
                    return;
                }
            }
        }
        
        self.widget = [RNSelphidPluginConfiguration generateConfiguration: self.widget
                                                                     mode: mode
                                                          ocrPreviousData: previousData
                                                            configuration: config];
        if (self.testImage != nil)
            self.widget.testImage = self.testImage;
        
        dispatch_async(dispatch_get_main_queue(), ^{
            UIViewController *rnViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
            [self.widget StartExtraction];
            [rnViewController presentViewController:self.widget animated:true completion:nil];
        });
        
    } @catch (NSError *e) {
        _reject(@"Exception", @"Exception", e);
    }
}

- (void)CaptureFinished {
    NSLog(@"startSelphidWidget finished");
    
    NSMutableDictionary *dictResult = [RNSelphidPluginResult parseResults:(FPhiSelphIDWidget *)self.widget compressFormat:self.compressFormat imageQuality:self.imageQuality];
    self.widget = nil;
    _resolve(dictResult);
}

/*
+(NSString*) getBase64FromUIImage:(UIImage*)thisImage compressFormat:(NSString*)compressFormat imageQuality:(int)imageQuality {
    //NSData *data = UIImageJPEGRepresentation([RNSelphidPluginUtils scaleAndRotateImage:thisImage], 0.9f);
    NSData *data;
    CGFloat quality = (CGFloat) ((int)imageQuality) / 100.0f;
    NSLog(@"Value of quality : %f\n", quality);
    if ([compressFormat isEqual: @"jpeg"]) {
        data = UIImageJPEGRepresentation([RNSelphidPluginUtils scaleAndRotateImage:thisImage], quality);
    }
    else {
        data = UIImagePNGRepresentation([RNSelphidPluginUtils scaleAndRotateImage:thisImage]);
    }
    
    return [RNSelphidPluginUtils base64forData:data];
}*/

/**
 Invoked when the extraction process fail.
 - Optional method
 */
-(void)CaptureFailed:(NSError *) error {
    NSLog(@"startSelphidWidget failed");
    self.widget = nil;
    _reject(@"OPERATION MODE ERROR",
            @"Failed process. Unhandled error.",
            error);
}

/**
 Invoked when extraction process is cancelled by user.
 - Optional method
 */
-(void)CaptureCancelled {
    NSLog(@"startSelphidWidget cancelled");
    
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    [dict setObject:[NSNumber numberWithInt:3] forKey:@"finishStatus"];
    [dict setObject:[NSNumber numberWithInt:2] forKey:@"errorType"];
    [dict setObject:[NSNumber numberWithInt:self.widget.results.captureProgress] forKey:@"timeoutStatus"];
    [dict setObject:[NSNumber numberWithInt:self.widget.results.captureProgress] forKey:@"captureProgress"];
    
    if(self.widget.results.lastActionBeforeClose != nil) {
        [dict setObject:self.widget.results.lastActionBeforeClose forKey:@"lastActionBeforeClose"];
    }
    
    self.widget = nil;
    _resolve(dict);
}

/**
 Invoked when extraction process is aborted by timeout.
 - Optional method
 */
-(void)CaptureTimeout {
    NSLog(@"startSelphidWidget timeout");
    
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    [dict setObject:[NSNumber numberWithInt:4] forKey:@"finishStatus"];
    [dict setObject:[NSNumber numberWithInt:2] forKey:@"errorType"];
    [dict setObject:[NSNumber numberWithInt:self.widget.results.captureProgress] forKey:@"timeoutStatus"];
    [dict setObject:[NSNumber numberWithInt:self.widget.results.captureProgress] forKey:@"captureProgress"];
    [dict setObject:self.widget.results.timeoutDiagnostic forKey:@"timeoutDiagnostic"];
    
    if(self.widget.results.lastActionBeforeClose != nil) {
        [dict setObject:self.widget.results.lastActionBeforeClose forKey:@"lastActionBeforeClose"];
    }
    
    self.widget = nil;
    _resolve(dict);
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onSelphidLogEvent"];
}

-(void)onEvent:(NSDate *)time type:(NSString *)type info:(NSString *)info {
    if (self.enableWidgetEventListener) {
        //NSLog(@"onSelphiLogEvent: (%lums) %@ - %@", (unsigned long)(time.timeIntervalSince1970*1000), type, info);
        //NSString* dateString = [NSDateFormatter localizedStringFromDate:[NSDate date] dateStyle:NSDateFormatterShortStyle timeStyle:NSDateFormatterMediumStyle];
        
        NSNumber *timeDouble = [NSNumber numberWithDouble:time.timeIntervalSince1970];
        NSString *timeString = [timeDouble stringValue];
        NSString *logString = [NSString stringWithFormat:@"{\"selphidLogInfo\":{\"time\":\"%@\", \"type\":\"%@\", \"info\":\"%@\"}}", timeString, type, info];
        
        [self sendEventWithName:@"onSelphidLogEvent" body: logString];
    }
}

@end
