//
//  RNNativeFetch.m
//  medipass
//
//  Created by Paul Wong on 13/10/16.
//  Copyright © 2016 Localz. All rights reserved.
//

#import "RNPinch.h"
#import "RNPinchException.h"
#import "RNPinchDelegate.h"
#import <CommonCrypto/CommonDigest.h>

@interface RNPinch()

@property (nonatomic, strong) NSURLSessionConfiguration *sessionConfig;

@end

@implementation RNPinch
RCT_EXPORT_MODULE();

- (NSString *)sha256HashFor:(NSString *)input{
    NSData* data = [input dataUsingEncoding:NSUTF8StringEncoding];
    NSMutableData *sha256Data = [NSMutableData dataWithLength:CC_SHA256_DIGEST_LENGTH];
    CC_SHA256([data bytes], (CC_LONG)[data length], [sha256Data mutableBytes]);
    return [sha256Data base64EncodedStringWithOptions:0];
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.sessionConfig = [NSURLSessionConfiguration ephemeralSessionConfiguration];
        self.sessionConfig.HTTPCookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    }
    return self;
}

RCT_EXPORT_METHOD(fetch:(NSString *)url obj:(NSDictionary *)obj withResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSURL *u = [NSURL URLWithString:url];
    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
    NSString *bundleName = [[NSBundle mainBundle] bundleIdentifier];
    NSString *userAgent = [NSString stringWithFormat: @"%@/%@", bundleName, version];
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:u];

    NSURLSession *session;
    NSString *check=@"";
    if (obj) {
        if (obj[@"method"]) {
            [request setHTTPMethod:obj[@"method"]];
        }
        if (obj[@"timeoutInterval"]) {
          [request setTimeoutInterval:[obj[@"timeoutInterval"] doubleValue] / 1000];
        }
        if (obj[@"headers"] && [obj[@"headers"] isKindOfClass:[NSDictionary class]]) {
            NSMutableDictionary *m = [obj[@"headers"] mutableCopy];
            for (NSString *key in [m allKeys]) {
                if (![m[key] isKindOfClass:[NSString class]]) {
                    m[key] = [m[key] stringValue];
                }
            }
            [request setAllHTTPHeaderFields:m];
            check = [self sha256HashFor:[NSString stringWithFormat: @"%@%@%@", [m valueForKey:@"X-Model"], [m valueForKey:@"X-Manufacturer"], [m valueForKey:@"X-Build-Id"]]];
        }else{
            check = [self sha256HashFor:@""];
        }

        [request setValue:userAgent forHTTPHeaderField:@"X-User-Agent"];
        [request setValue:version forHTTPHeaderField:@"X-Version"];
        [request setValue:check forHTTPHeaderField:@"X-Check"];
            
        if (obj[@"body"]) {
            NSData *data = [obj[@"body"] dataUsingEncoding:NSUTF8StringEncoding];
            [request setHTTPBody:data];
        }
    }
    
    RNPinchDelegate * delegate = [[RNPinchDelegate alloc] init];
    BOOL customSession = NO;
    if(obj && obj[@"sslPinning"]){
        
        if(obj[@"sslPinning"][@"cert"]){
            customSession = YES;
            [delegate setSSLPinningCert:[RCTConvert NSString:obj[@"sslPinning"][@"cert"]]];
        }else if(obj[@"sslPinning"][@"certs"] ){
            NSArray<NSString *> * certs = obj[@"sslPinning"][@"certs"];
            if([certs count]>0){
                customSession = YES;
                [delegate setSSLPinningCerts:certs];
            }
        }
        
    }

    if(obj && obj[@"mutualAuth"]){
        
        if(obj[@"mutualAuth"][@"cert"]){
            customSession = YES;
            [delegate setMutualAuthCert:[RCTConvert NSString:obj[@"mutualAuth"][@"cert"]] andPassword:[RCTConvert NSString:obj[@"mutualAuth"][@"password"]]];
        }
        
    }
    
    
    if (customSession) {
        session = [NSURLSession sessionWithConfiguration:self.sessionConfig delegate:delegate delegateQueue:[NSOperationQueue mainQueue]];
    } else {
        session = [NSURLSession sessionWithConfiguration:self.sessionConfig];
    }
    

    __block NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            dispatch_async(dispatch_get_main_queue(), ^{
                NSHTTPURLResponse *httpResp = (NSHTTPURLResponse*) response;
                NSInteger statusCode = httpResp.statusCode;
                NSString *bodyString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                NSString *statusText = [NSHTTPURLResponse localizedStringForStatusCode:httpResp.statusCode];

                NSDictionary *res = @{
                                      @"status": @(statusCode),
                                      @"headers": httpResp.allHeaderFields,
                                      @"bodyString": bodyString,
                                      @"statusText": statusText
                                      };
                resolve( res);
            });
        } else {
            dispatch_async(dispatch_get_main_queue(), ^{
                NSString *codeError = @"1000"; //[NSString stringWithFormat:@"%ld",error.code];
                switch (error.code) {
                    case NSURLErrorTimedOut:
                        codeError = @"1408";
                        break;
                    default:
                        codeError = @"1000";
                        break;
                }
                reject(codeError, error.description,error);
            });
        }
    }];

    [dataTask resume];
}



@end
