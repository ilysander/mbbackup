#import <FPhiSelphIDWidgetiOS/FPhiSelphIDWidgetiOS.h>
#import "RNSelphidPluginUtils.h"

@interface RNSelphidPluginResult : NSObject
    +(NSMutableDictionary *)parseResults:(FPhiSelphIDWidget *)widget compressFormat:(NSString *)compressFormat imageQuality:(int)imageQuality;
@end
