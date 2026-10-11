#import <React/RCTBridgeModule.h>
#import "RNSelphidPluginUtils.h"
#import "RNSelphidPluginConfiguration.h"
#import "RNSelphidPluginResult.h"
#import <React/RCTEventEmitter.h>
#import <FPhiSelphIDWidgetiOS/FPhiSelphIDWidgetiOS.h>

@interface RNSelphidPluginModule: RCTEventEmitter <RCTBridgeModule, FPhiSelphIDWidgetProtocol>
    @property (nonatomic) FPhiSelphIDWidget *widget;
    @property (nonatomic) RCTPromiseResolveBlock resolve;
    @property (nonatomic) RCTPromiseRejectBlock reject;
    @property (nonatomic) bool enableWidgetEventListener;
    @property (nonatomic) UIImage* testImage;
    @property (nonatomic) NSString* compressFormat;
    @property (nonatomic) int imageQuality;
@end
