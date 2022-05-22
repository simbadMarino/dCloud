//
//  btfs.m
//  justshare
//
//  Created by Simbad Marino on 19/05/22.
//

//#import <Foundation/Foundation.h>
#import "btfs.h"
#import "btfs_node.h"


@implementation btfs

RCT_EXPORT_MODULE();



RCT_EXPORT_METHOD(init: (NSString*)configString
                            callback: (RCTResponseSenderBlock)callback)
{
  /*char *text = "init";
  NSString *message = [NSString stringWithFormat:@"%s",text];
  NSString string = mainC(*message);

  NSArray *stringArray = @[string];
  callback(stringArray);*/
  printf("Hello world");
}

@end
