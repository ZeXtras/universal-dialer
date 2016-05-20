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

function UniversalDialerPbxManager(defaultPbx) {
  this.strUtl = new UniversalDialerStringUtils();

  this.pbxMap = {};
  this.currentPbxName = defaultPbx;
}

UniversalDialerPbxManager.prototype.constructor = UniversalDialerPbxManager;

UniversalDialerPbxManager.prototype.registerPbx = function (pbx) {
  this.pbxMap[pbx.getName()] = pbx;
};

UniversalDialerPbxManager.prototype.getPbxSettings = function () {
  if (this.pbxMap.hasOwnProperty(this.currentPbxName)) {
    return this.pbxMap[this.currentPbxName].getUserProperties();
  } else {
    appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("errServerUnknown"), level: 3});
    return [];
  }
};

UniversalDialerPbxManager.prototype.validateNumber = function (settings, callback) {
  return this.pbxMap[this.currentPbxName].validate(settings, callback)
};

UniversalDialerPbxManager.prototype.sendCall = function (callee) {
  this.pbxMap[this.currentPbxName].sendCall(callee.replace(/[^0-9+*#]/g, '').replace(/\+/g, '00'));
};
