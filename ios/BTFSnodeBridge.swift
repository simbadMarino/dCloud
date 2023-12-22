//
//  BTFSnodeBridge.swift
//  justshare
//
//  Created by Simbad Marino on 25/05/22.
//

import Foundation

@objc(RCTBTFSmodule)
class RCTBTFSmodule: NSObject {

  @objc(main:command:)
  func main(name: String, command: UnsafeMutablePointer<Int8>) -> Void {
    let txt = UnsafeMutablePointer<Int8>(mutating: (name as NSString).utf8String)
   //var String = "daemon --chain-id 199";
    print("Command from React Native: ");
   NSLog("%@", name);
    
    mainC(txt);
   //__mainC(UnsafeMutablePointer<Int8>(mutating: (String, NSString).utf8String));
    // release the memory to the C String
    
    //txt?.deallocate();
    
 }

 @objc
 func constantsToExport() -> [String: Any]! {
   return ["someKey": "someValue"]
   
 }
  
  @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
  
  

}
