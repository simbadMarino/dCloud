//
//  BTFSnodeBridge.m
//  justshare
//
//  Created by Simbad Marino on 25/05/22.
//

#import <Foundation/Foundation.h>
// BTFSnodeBridge.m
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RCTBTFSmodule, NSObject)

RCT_EXTERN_METHOD(main:(NSString *)name command:(NSString *)command)

@end
