
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif
#import <FPhiWidgetSelphi/FPhiWidgetSelphi.h>
#import <React/RCTEventEmitter.h>

@interface RNSelphiFacePluginModule : RCTEventEmitter <RCTBridgeModule, FPhiWidgetProtocol>
    @property (nonatomic) FPhiWidget *uc;
    @property (nonatomic) RCTPromiseResolveBlock resolve;
    @property (nonatomic) RCTPromiseRejectBlock reject;
    @property (nonatomic) bool enableImages;
    @property (nonatomic) bool isQRValid;
    @property (nonatomic) bool enableWidgetEventQRListener;
    @property (nonatomic) bool enableWidgetEventListener;
    @property (nonatomic) bool enableGenerateTemplateRaw;
    @property (nonatomic) NSString *bestImageTemplateRaw;
@end
  
