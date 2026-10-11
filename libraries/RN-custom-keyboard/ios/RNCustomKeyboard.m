

#import "RNCustomKeyboard.h"
#import <React/RCTBridge+Private.h>
#import <React/RCTUIManager.h>
#import "RCTBaseTextInputView.h"

@implementation RNCustomKeyboard{
    BOOL shouldSubmit;
    NSMutableDictionary *dict;

}

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE(CustomKeyboard)

RCT_EXPORT_METHOD(install:(nonnull NSNumber *)reactTag withType:(nonnull NSString *)keyboardType maxLength:(int) maxLength inputViewHeight:(int) inputViewHeight)
{
    if (dict==nil){
        dict =  [[NSMutableDictionary alloc] initWithDictionary:@{}];
    }
    if (dict[reactTag]!=nil){
        return ;
    }
    RCTRootView * _inputView = [[RCTRootView alloc] initWithBridge:((RCTBridge *)_bridge).parentBridge moduleName:@"CustomKeyboard" initialProperties:
                                @{
                                  @"tag": reactTag,
                                  @"type": keyboardType
                                  }
                                ];
    
    dict[reactTag] = @(1);

    //[_inputView setP ];
    if (_dicInputMaxLength == nil) {
        _dicInputMaxLength = [NSMutableDictionary dictionaryWithCapacity:0];
    }
    
    if (maxLength>0){
        [_dicInputMaxLength setValue:[NSNumber numberWithInt:maxLength] forKey:[reactTag stringValue]];
    }
    
    _inputView.autoresizingMask = UIViewAutoresizingNone;
    UITextView *view = (UITextView *)(((RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);
    
   
    //* temporarily solution for duplicating default text
    //* the first call of "insertText" when default text is existed, default text will be copied after inserting text.
    //* I couldn't find exactly reason but this protects duplicating text.
    //[view replaceRange:view.selectedTextRange withText:@""];
    
    int bottomPadding = 0;
    if (@available(iOS 11.0, *)) {
        UIWindow *window = UIApplication.sharedApplication.keyWindow;
        bottomPadding = window.safeAreaInsets.bottom;
    }
    
    _inputView.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, inputViewHeight + bottomPadding);
    _inputView.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0];
    if([keyboardType containsString:@"-otp"]){
        if (@available(iOS 12.0, *)) {
            NSLog(@"RNCustomKeyboard using UITextContentTypeOneTimeCode");
            view.textContentType = UITextContentTypeOneTimeCode;
        }else{
            view.inputView = _inputView;
        }
    }else{
        view.inputView = _inputView;
    }
    [view reloadInputViews];
}

RCT_EXPORT_METHOD(uninstall:(nonnull NSNumber *)reactTag)
{
    UITextView *view = (UITextView *)(((RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);
    
    view.inputView = nil;
    dict[reactTag] = nil;
    [view reloadInputViews];
}

- (UITextView*)getRealTextView:(UITextView*)reactView {
    if ([self canInputText:reactView]) {
        return reactView;
    }
    // RN 0.50 后 RCTTextField 不是继承自 UITextField 了，多包了一层，这里遍历一下去查找
  /* for (UITextView *aView in reactView.subviews) {
        if ([self canInputText:aView]) {
            ((UITextView*)aView).inputView = nil;
        }
    }*/
    return reactView;
}
- (BOOL)canInputText:(UIView*)view {
    return [view isKindOfClass:[UITextField class]] || [view isKindOfClass:[UITextView class]];
}

RCT_EXPORT_METHOD(getSelectionRange:(nonnull NSNumber *)reactTag callback:(RCTResponseSenderBlock)callback) {
    UITextView *view = (UITextView *)(((RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);
    UITextRange* range = view.selectedTextRange;
    
    const NSInteger start = [view offsetFromPosition:view.beginningOfDocument toPosition:range.start];
    const NSInteger end = [view offsetFromPosition:view.beginningOfDocument toPosition:range.end];
    callback(@[@{@"text":view.text, @"start":[NSNumber numberWithInteger:start], @"end":[NSNumber numberWithInteger:end]}]);
}

RCT_EXPORT_METHOD(submitEditing:(nonnull NSNumber *)reactTag) {
    RCTBaseTextInputView * baseView = (RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag];
    UITextView *view = (UITextView *)(baseView.backedTextInputView);

    if(baseView.blurOnSubmit){
        [view reactBlur];
    }
    [_bridge.eventDispatcher sendTextEventWithType:RCTTextEventTypeSubmit
                                          reactTag:reactTag
                                              text:view.attributedText.string
                                               key:nil
                                        eventCount:0];
    
}


RCT_EXPORT_METHOD(insertKey:(nonnull NSNumber *)reactTag withText:(NSString*)text) {
    UITextView *view = (UITextView *)(((RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);
    [_bridge.eventDispatcher sendTextEventWithType:RCTTextEventTypeKeyPress
                                          reactTag:reactTag
                                              text:view.attributedText.string
                                               key:text
                                        eventCount:0];
    
}


RCT_EXPORT_METHOD(insertText:(nonnull NSNumber *)reactTag withText:(NSString*)text) {
    UITextView *view = (UITextView *)(((RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);
    if (_dicInputMaxLength != nil) {
        NSString *textValue = [NSString stringWithFormat:@"%@", view.text];
        int  maxLegth = [_dicInputMaxLength[reactTag.stringValue] intValue];
        if (maxLegth>0 && [textValue length] >= maxLegth) {
            return;
        }
    }
    [view replaceRange:view.selectedTextRange withText:text];
}
RCT_EXPORT_METHOD(setText:(nonnull NSNumber *)reactTag withText:(NSString*)text) {
    UITextView *view = (UITextView *)(((RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);
    if (_dicInputMaxLength != nil) {
        NSString *textValue = [NSString stringWithFormat:@"%@", view.text];
        int  maxLegth = [_dicInputMaxLength[reactTag.stringValue] intValue];
        if (maxLegth>0 && [textValue length] >= maxLegth) {
            return;
        }
    }
    [view setText:text];
}

RCT_REMAP_METHOD(getText, withTag:(nonnull NSNumber *)reactTag resolver: (RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    UITextView *view = (UITextView *)(((RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);
    //NSString * text = [NSString initWithFormat:@"%@", view.text];
    if (view.text.length > 0){

        resolve(@{@"text":view.text});
    }else{
        
        resolve(@{@"text":@""});
    }
}

RCT_EXPORT_METHOD(backSpace:(nonnull NSNumber *)reactTag) {
    UITextView *view = (UITextView *)(((RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);
    
    UITextRange* range = view.selectedTextRange;
    if ([view comparePosition:range.start toPosition:range.end] == 0) {
        range = [view textRangeFromPosition:[view positionFromPosition:range.start offset:-1] toPosition:range.start];
    }
    [view replaceRange:range withText:@""];
}

RCT_EXPORT_METHOD(doDelete:(nonnull NSNumber *)reactTag) {
    UITextView *view = (UITextView *)(((RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);
    
    UITextRange* range = view.selectedTextRange;
    if ([view comparePosition:range.start toPosition:range.end] == 0) {
        range = [view textRangeFromPosition:range.start toPosition:[view positionFromPosition: range.start offset: 1]];
    }
    [view replaceRange:range withText:@""];
}

RCT_EXPORT_METHOD(moveLeft:(nonnull NSNumber *)reactTag) {
    UITextView *view = (UITextView *)(((RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);
    
    UITextRange* range = view.selectedTextRange;
    UITextPosition* position = range.start;
    
    if ([view comparePosition:range.start toPosition:range.end] == 0) {
        position = [view positionFromPosition: position offset: -1];
    }
    
    view.selectedTextRange = [view textRangeFromPosition: position toPosition:position];
}

RCT_EXPORT_METHOD(moveRight:(nonnull NSNumber *)reactTag) {
    UITextView *view = (UITextView *)(((RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);
    
    UITextRange* range = view.selectedTextRange;
    UITextPosition* position = range.end;
    
    if ([view comparePosition:range.start toPosition:range.end] == 0) {
        position = [view positionFromPosition: position offset: 1];
    }
    
    view.selectedTextRange = [view textRangeFromPosition: position toPosition:position];
}

RCT_EXPORT_METHOD(deleteLeftAll:(nonnull NSNumber *)reactTag) {
    UITextView *view = (UITextView *)(((RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);
    
    UITextRange* range = view.selectedTextRange;
    
    const NSInteger distance = [view offsetFromPosition:view.beginningOfDocument toPosition:range.end];
    if (0 < distance) {
        UITextRange* rangeToDelete = [view textRangeFromPosition:view.beginningOfDocument toPosition:range.end];
        if (rangeToDelete) {
            [view replaceRange:rangeToDelete withText:@""];
        }
    }
}

RCT_EXPORT_METHOD(hideKeyboard:(nonnull NSNumber *)reactTag) {
    UITextView *view = (UITextView *)(((RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);

    [view reactBlur];
}

RCT_EXPORT_METHOD(switchSystemKeyboard:(nonnull NSNumber*) reactTag) {
    UITextView *view = (UITextView *)(((RCTBaseTextInputView*)[_bridge.uiManager viewForReactTag:reactTag]).backedTextInputView);
    UIView* inputView = view.inputView;
    view.inputView = nil;
    [view reloadInputViews];
    view.inputView = inputView;
}
@end
