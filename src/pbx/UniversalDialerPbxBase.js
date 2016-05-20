/*
 * Universal Dialer - An universal click2call zimlet for Zimbra 
 * Copyright (C) 2016 ZeXtras S.r.l. 
 *
 * This file is part of Universal Dialer.
 *
 * This program is free software; you can redistribute it and/or 
 * modify it under the terms of the GNU General Public License 
 * as published by the Free Software Foundation, version 2 of 
 * the License. 
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the 
 * GNU General Public License for more details. 
 *
 * You should have received a copy of the GNU General Public License 
 * along with Universal Dialer. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * AddPbx: interface class that must be implemented
 */
function UniversalDialerPbxBase(zimlet) {
  this.zimlet = zimlet;
  this.strUtl = new UniversalDialerStringUtils();
}

/**
 * AddPbx: return PbxName
 */
UniversalDialerPbxBase.prototype.getName = function () {
  throw new Error("Not yet implemented");
};


/**
 * AddPbx: insert here custom make call request to Pbx
 */
UniversalDialerPbxBase.prototype.sendCall = function (callee) {
  throw new Error("Not yet implemented");
};


/**
 * AddPbx: insert here custom auth request to Pbx,
 * @param settings: array of [UniversalDialerProperty]
 * @param callback: callback that save properties
 *  callback.run(boolean) save properties
 *  or, if using extension, insert callback in Soap request
 */

UniversalDialerPbxBase.prototype.validate = function (settings, callback) {
  throw new Error("Not yet implemented");
};


/**
 * AddPbx: list of custom user properties,
 * these must be listed in org_zetalliance_universaldialer.xml at userProperties tag
 * @return array of [UniversalDialerProperty]
 */
UniversalDialerPbxBase.prototype.getUserProperties = function () {
  throw new Error("Not yet implemented");
};

/**
 * Common function that can be override or not used
 * @param result
 */
UniversalDialerPbxBase.prototype.manageResult = function (result) {
  if (result.success) {
    appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("successCall"), level: 1});
  } else {
    appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("errServer"), level: 3});
  }
};

/**
 * Common function to recover value of a given property
 * @param settings: array of [UniversalDialerProperty]
 * @param propertyName
 */
UniversalDialerPbxBase.extractPropertyValue = function (settings, propertyName) {
  for (var index = 0; index < settings.length; index += 1) {
    if (settings[index].getName() === propertyName) {
      return settings[index].getValue();
    }
  }
  return void 0;
};
