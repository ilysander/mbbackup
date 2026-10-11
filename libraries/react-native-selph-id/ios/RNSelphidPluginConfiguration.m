#import "RNSelphidPluginConfiguration.h"


@implementation RNSelphidPluginConfiguration

+(FPhiSelphIDWidget*)generateConfiguration:(FPhiSelphIDWidget *)widget
                                      mode: (NSString *)mode
                           ocrPreviousData:(NSString*)previousData
                             configuration:(NSDictionary*)config
{
    @try {
        if (config != nil) {
            NSObject *generateRawImages = [config objectForKey:@"generateRawImages"];
            if (generateRawImages != nil)
                widget.generateRawImages = ((NSNumber *)generateRawImages).boolValue;
            
            NSObject *debug = [config objectForKey:@"debug"];
            if (debug != nil)
                widget.debugMode = ((NSNumber *)debug).boolValue;
            
            NSObject *showAfterCapture = [config objectForKey:@"showResultAfterCapture"];
            if (showAfterCapture != nil)
                widget.showAfterCapture = ((NSNumber *)showAfterCapture).boolValue;
            
            NSObject *showTutorial = [config objectForKey:@"showTutorial"];
            if (showTutorial != nil)
                widget.showTutorial = ((NSNumber *)showTutorial).boolValue;
            //_uc.showTutorial = false;
            
            NSString *scanMode = [config objectForKey:@"scanMode"]; // Front, Back, Wizard
            if (scanMode != nil) {
                if ([scanMode compare:@"generic"] == NSOrderedSame) {
                    widget.scanMode = SMGeneric;
                } else if ([scanMode compare:@"specific"] == NSOrderedSame) {
                    widget.scanMode = SMSpecific;
                } else if ([scanMode compare:@"search"] == NSOrderedSame) {
                    widget.scanMode = SMSearch;
                } else {
                    widget.scanMode = SMGeneric;
                }
                
                NSObject *specificData = [config objectForKey:@"specificData"];
                if (specificData != nil && specificData != (NSString*)[NSNull null])
                    widget.specificData = ((NSString *)specificData);
                else
                    widget.specificData = @"";
            }
            
            NSObject *tokenImageQuality = [config objectForKey:@"tokenImageQuality"];
            if (tokenImageQuality != nil)
                widget.tokenImageQuality = ((NSNumber *)tokenImageQuality).floatValue;
            
            NSObject *wizardMode = [config objectForKey:@"wizardMode"];
            if (wizardMode != nil) {
                widget.wizardMode = ((NSNumber *)wizardMode).boolValue;
            }
            
            NSObject *locale = [config objectForKey:@"locale"];
            if (locale != nil && locale != (NSString*)[NSNull null])
                widget.locale = ((NSString *)locale);
            else
                widget.locale = @"";
            
            NSObject *videoFilename = [config objectForKey:@"videoFilename"];
            if (videoFilename != nil && videoFilename != (NSString*)[NSNull null])
                widget.videoFilename = ((NSString *)videoFilename);
            else
                widget.videoFilename = @"";
            
            NSObject *documentModels = [config objectForKey:@"documentModels"];
            if (documentModels != nil && documentModels != (NSString*)[NSNull null])
                widget.documentModels = ((NSString *)documentModels);
            else
                widget.documentModels = @"";
            
            
            NSString *documentType = [config objectForKey:@"documentType"]; // Front, Back, Wizard
            if (documentType != nil) {
                if ([documentType compare:@"DT_IDCard"] == NSOrderedSame) {
                    widget.scanType = DTIDCard;
                } else if ([documentType compare:@"DT_Passport"] == NSOrderedSame) {
                    widget.scanType = DTPassport;
                } else if ([documentType compare:@"DT_DriverLicense"] == NSOrderedSame) {
                    widget.scanType = DTDriversLicense;
                } else if ([documentType compare:@"DT_ForeignCard"] == NSOrderedSame) {
                    widget.scanType = DTForeignCard;
                } else if ([documentType compare:@"DT_CreditCard"] == NSOrderedSame) {
                    widget.scanType = DTCreditCard;
                } else if ([documentType compare:@"DT_Custom"] == NSOrderedSame) {
                    widget.scanType = DTCustom;
                } else {
                    widget.scanType = DTIDCard;
                }
            }
            
            NSObject *translationsContent = [config objectForKey:@"translationsContent"];
            if (translationsContent != nil && translationsContent != (NSString*)[NSNull null])
                widget.translationsContent = ((NSString *)translationsContent);
            
            NSObject *viewsContent = [config objectForKey:@"viewsContent"];
            if (viewsContent != nil && viewsContent != (NSString*)[NSNull null])
                widget.viewsContent = ((NSString *)viewsContent);
            
            NSDictionary *params = [config objectForKey:@"params"];
            //NSLog(@"%@", params);
            if (params != nil) {
                for (NSString* key in [params allKeys]) {
                    NSString* value = params[key];
                    [widget setParam:key withValue:value];
                }
            }
        }
        
        if ([mode compare:@"mode_front"] == NSOrderedSame) {
            widget.scanSide = DSFront;
            widget.wizardMode = false;
        } else if ([mode compare:@"mode_back"] == NSOrderedSame) {
            widget.scanSide = DSBack;
            widget.wizardMode = false;
        } else if ([mode compare:@"mode_wizard"] == NSOrderedSame) {
            widget.scanSide = DSFront;
            widget.wizardMode = true;
        } else {
            [NSException raise:@"OPERATION MODE ERROR" format:@"The mode selected doesn't exist."];
        }
        
        if (widget.wizardMode)
            widget.tokenPreviousCaptureData = nil;
        else {
            if (previousData != nil && previousData != (NSString*)[NSNull null])
                widget.tokenPreviousCaptureData = previousData;
        }
        
        return widget;
        
    } @catch (NSError *e) {
        [NSException raise:@"CONFIGURATION ERROR" format: @"%@", e];
    }
}

@end
