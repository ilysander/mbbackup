#import "RNSelphidPluginResult.h"

@implementation RNSelphidPluginResult

    +(NSMutableDictionary *) parseResults:(FPhiSelphIDWidget *)widget compressFormat:(NSString *)compressFormat imageQuality:(int)imageQuality {
        @try {
            FPhiSelphIDWidgetExtractionData * data = widget.results;
            
            NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
            // Generic data
            [dict setObject:[NSNumber numberWithInt:1] forKey:@"finishStatus"];
            [dict setObject:[NSNumber numberWithInt:2] forKey:@"errorType"];
            [dict setObject:[NSNumber numberWithInt:widget.results.captureProgress] forKey:@"timeoutStatus"];
            [dict setObject:[NSNumber numberWithInt:widget.results.captureProgress] forKey:@"captureProgress"];
                        
            if(data.documentCaptured != nil) {
                [dict setObject:data.documentCaptured forKey:@"lastDocumentCaptured"];
            }
            
            if(data.rawBackDocument != nil)
                [dict setObject:[RNSelphidPluginUtils getBase64FromUIImage:data.rawBackDocument compressFormat:compressFormat imageQuality:imageQuality] forKey:@"rawBackDocument"];
            if(data.rawFrontDocument != nil)
                [dict setObject:[RNSelphidPluginUtils getBase64FromUIImage:data.rawFrontDocument compressFormat:compressFormat imageQuality:imageQuality] forKey:@"rawFrontDocument"];
            if(data.frontDocument != nil)
                [dict setObject:[RNSelphidPluginUtils getBase64FromUIImage:data.frontDocument compressFormat:compressFormat imageQuality:imageQuality] forKey:@"frontDocumentImage"];
            if(data.backDocument != nil)
                [dict setObject:[RNSelphidPluginUtils getBase64FromUIImage:data.backDocument compressFormat:compressFormat imageQuality:imageQuality] forKey:@"backDocumentImage"];
            if(data.faceImage != nil)
                [dict setObject:[RNSelphidPluginUtils getBase64FromUIImage:data.faceImage compressFormat:compressFormat imageQuality:imageQuality] forKey:@"faceImage"];
           if(data.signatureImage != nil)
                [dict setObject:[RNSelphidPluginUtils getBase64FromUIImage:data.signatureImage compressFormat:compressFormat imageQuality:imageQuality] forKey:@"signatureImage"];
            if(data.fingerprintImage != nil)
                [dict setObject:[RNSelphidPluginUtils getBase64FromUIImage:data.fingerprintImage compressFormat:compressFormat imageQuality:imageQuality]
                        forKey:@"fingerprintImage"];
            
            if(data.tokenRawFrontDocument != nil)
                [dict setObject:data.tokenRawFrontDocument forKey:@"tokenRawFrontDocument"];
            if(data.tokenRawBackDocument != nil)
                [dict setObject:data.tokenOCR forKey:@"tokenRawBackDocument"];
            if(data.tokenOCR != nil)
                [dict setObject:data.tokenOCR forKey:@"tokenOCR"];
            if(data.tokenFaceImage != nil)
                [dict setObject:data.tokenFaceImage forKey:@"tokenFaceImage"];
            if(data.tokenFrontDocument != nil)
                [dict setObject:data.tokenFrontDocument forKey:@"tokenFrontDocument"];
            if(data.tokenBackDocument != nil)
                [dict setObject:data.tokenBackDocument forKey:@"tokenBackDocument"];
            if(data.lastActionBeforeClose != nil)
                [dict setObject:data.lastActionBeforeClose forKey:@"lastActionBeforeClose"];
            
            NSMutableDictionary* dictOCR = [[NSMutableDictionary alloc] init];
            for (NSString *key in [data.ocrResults allKeys]) {
                [dictOCR setObject:data.ocrResults[key] forKey:[key componentsSeparatedByString:@"/"].lastObject];
            }
            
            NSError* errorData;
            NSData* dictData = [NSJSONSerialization dataWithJSONObject:dictOCR
                                                            options: 0
                                                                error:&errorData];
            NSString* jsonString = [[NSString alloc] initWithData:dictData encoding:NSUTF8StringEncoding];
            if(jsonString != nil){
                [dict setObject:jsonString forKey:@"documentData"];
            }
            
            
            [dict setObject:[NSNumber numberWithFloat:data.matchingSidesScore]  forKey:@"matchingSidesScore"];
            
            return dict;
        } @catch (NSError *e) {
            [NSException raise:@"RESULT ERROR" format: @"%@", e];
        }
    }

@end
