//
//  BTFSnodeBridge.swift
//  justshare
//
//  Created by Simbad Marino on 25/05/22.
//

import Foundation
// CalendarManager.swift

@objc(RCTBTFSmodule)
class RCTBTFSmodule: NSObject {

  @objc(main:command:)
  func main(_ name: String, command: UnsafeMutablePointer<Int8>) -> Void {
    let txt: String = name
   // Date is ready to use!
   //var String = "daemon --chain-id 199";
   NSLog("%@", name);
    mainC(UnsafeMutablePointer<Int8>(mutating: (txt as NSString).utf8String))
   //__mainC(UnsafeMutablePointer<Int8>(mutating: (String, NSString).utf8String));
 }

 @objc
 func constantsToExport() -> [String: Any]! {
   return ["someKey": "someValue"]
 }

}
