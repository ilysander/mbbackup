#import <React/RCTBridgeModule.h>
#import <FPhiSelphIDWidgetiOS/FPhiSelphIDWidgetiOS.h>


@interface RNSelphidPluginConfiguration : NSObject
+(FPhiSelphIDWidget*)generateConfiguration:(FPhiSelphIDWidget *)widget mode:(NSString *)mode ocrPreviousData:(NSString*)previousData configuration:(NSDictionary*)config;

@end
