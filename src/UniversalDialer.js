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

function org_zetalliance_universaldialer_HandlerObject() {
}
org_zetalliance_universaldialer_HandlerObject.prototype = new ZmZimletBase();
org_zetalliance_universaldialer_HandlerObject.prototype.constructor = org_zetalliance_universaldialer_HandlerObject;

var UniversalDialerBase = org_zetalliance_universaldialer_HandlerObject;

UniversalDialerBase.prototype.init = function () {
  this.strUtl = new UniversalDialerStringUtils();
  this.zimletConfigured = (this.getConfig("server") != "needToChange");
  
  if (this.zimletConfigured) {

    this.pbxManager = new UniversalDialerPbxManager(this.getConfig("server"));
    this.pbxManager.registerPbx(new UniversalDialer3cx(this));
    this.pbxManager.registerPbx(new UniversalDialerAsterisk(this));
    this.pbxManager.registerPbx(new UniversalDialerMetaSwitch(this));
    this.pbxManager.registerPbx(new UniversalDialerSipX(this));

  }
  else {
    appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("notConfigured"), level: 2});
  }
};

UniversalDialerBase.prototype.singleClicked = function () {
  if (this.zimletConfigured) {
    if (this.getUserProperty("UDuserNumber") === "") {
      appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("sourcePhoneNotSet"), level: 2});
      this._settingsDialogPopup();
    } else {
      this._callDialogPopup();
    }
  } else appCtxt.getAppController().setStatusMsg({msg: this.getMessage("notConfigured"), level: 2});
};

UniversalDialerBase.prototype.doubleClicked = function () {
  if (this.zimletConfigured) {
    this._settingsDialogPopup();
  } else appCtxt.getAppController().setStatusMsg({msg: this.getMessage("notConfigured"), level: 2});
};

UniversalDialerBase.prototype.toolTipPoppedUp = function (spanElement, contentObjText) {
  var toolTip = new DwtToolTip(appCtxt.getShell());
  toolTip.setContent(this.strUtl.getMessage("rightClickToDial") + " <b>" + contentObjText + "</b>");
  toolTip.popup();
};

UniversalDialerBase.prototype.menuItemSelected = function (itemId) {
  if (this.zimletConfigured) {
    switch (itemId) {
      case "CALL":
        if (this.getUserProperty("UDuserNumber") === "") {
          appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("sourcePhoneNotSet"), level: 2});
          this._settingsDialogPopup();
        } else {
          this._callDialogPopup();
        }
        break;
      case "CALLFROMREGEX":
        if (this.getUserProperty("UDuserNumber") === "") {
          appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("sourcePhoneNotSet"), level: 2});
          this._settingsDialogPopup();
        } else {
          this.pbxManager.sendCall(this._actionSpan.textContent);
        }
        break;
      case "SETTINGS":
        this._settingsDialogPopup();
        break;
    }
  } else appCtxt.getAppController().setStatusMsg({msg: this.getMessage("notConfigured"), level: 2});
};

UniversalDialerBase.prototype._settingsDialogPopup = function () {
  if (typeof this.settingsDialog === "undefined") {
    this.settingsDialog = new UniversalDialerSettingsDialog(this, this.pbxManager);
  }
  this.settingsDialog.popup();
};

UniversalDialerBase.prototype._callDialogPopup = function () {
  if (typeof this.callDialog === "undefined") {
    this.callDialog = new UniversalDialerCallDialog(this.pbxManager);
  }
  this.callDialog.popup();
};
