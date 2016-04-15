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

function org_zetalliance_universaldialer_HandlerObject() {}
org_zetalliance_universaldialer_HandlerObject.prototype = new ZmZimletBase();
org_zetalliance_universaldialer_HandlerObject.prototype.constructor = org_zetalliance_universaldialer_HandlerObject;

var UniversalDialerBase = org_zetalliance_universaldialer_HandlerObject;

UniversalDialerBase.prototype.init = function () {
  this.zimletConfigured = (this.getConfig("server") != "needToChange");
  if (this.zimletConfigured) {
    this.viewManager = new UniversalDialerViews();
    this.dialogManager = new UniversalDialerDialogs(this.viewManager);
    this.settingsManager = new UniversalDialerSettings(this);
    this.connectionManager = new UniversalDialerConnection();
  } else appCtxt.getAppController().setStatusMsg({msg: this.getMessage("notConfigured"), level: 2});
};

UniversalDialerBase.prototype.singleClicked = function() {
  this.dialogManager.createCallDialog(this, "");
};

UniversalDialerBase.prototype.doubleClicked = function() {
  this.dialogManager.createCallDialog(this, "");
};

UniversalDialerBase.prototype.toolTipPoppedUp = function(spanElement, contentObjText, matchContext, canvas) {
  var toolTip = new DwtToolTip(appCtxt.getShell());
  toolTip.setContent(this.getMessage("rightClickToDial") + " <b>"+contentObjText+"</b>");
  toolTip.popup();
  // canvas.innerHTML = this.viewManager._createTooltip(contentObjText,this.getMessage("rightClickToDial"));
};

UniversalDialerBase.prototype.menuItemSelected = function (itemId) {
  if (this.zimletConfigured) {
    switch (itemId) {
      case "CALL":
        this.dialogManager.createCallDialog(this, "");
        break;
      case "CALLFROMREGEX":
        if (this.getUserProperty("voip_user") == "") {
          this.displayStatusMessage({msg: this.getMessage("sourcePhoneNotSet"), level: 2});
          this.dialogManager.createSettingsDialog(this);
        } else this._sendCall(this._actionSpan.textContent);
        break;
      case "SETTINGS":
        this.dialogManager.createSettingsDialog(this);
        break;
    }
  } else appCtxt.getAppController().setStatusMsg({msg: this.getMessage("notConfigured"), level: 2});
};

UniversalDialerBase.prototype._saveUserProperty = function () {
  var voipUser = document.getElementById("VoIPPhoneId").value;
  var pin = document.getElementById("VoIPPhonePin") ? document.getElementById("VoIPPhonePin").value : "";
  if (voipUser.trim() != "" && pin.trim() != "") {
    var dialContext = document.getElementById("dialContextId") ? document.getElementById("dialContextId").value : "";
    if (this.connectionManager.checkUser(voipUser, pin, this.settingsManager.getServerInfo(), this.getMessage("successCheckAuth"), this.getMessage("errCheckAuth"))) {
      this.setUserProperty("voip_user", voipUser, true);
      this.setUserProperty("voip_pin", pin, true);
      this.setUserProperty("dial_context", dialContext, true);
      this.settingsManager.setUserAndDialContext(voipUser, pin, dialContext);
      this.dialogManager.closeSettingsDialog();
    }
  } else appCtxt.getAppController().setStatusMsg({msg: this.getMessage("inputFieldEmptyInSettings"), level: 2});
};

UniversalDialerBase.prototype._sendCall = function (callee) {
  if (typeof callee !== "string") callee = document.getElementById("calleeId");
  if (callee.value !== "") {
    callee.disabled = true;
    this.connectionManager.sendCall(callee.value, this.dialogManager, this.settingsManager.getServerInfo(), this.settingsManager.getSettings());
  }  else {
    appCtxt.getAppController().setStatusMsg({msg: this.getMessage("destPhoneEmpty"), level: 2});
    this.dialogManager.closeCallDialog();
  }
};

UniversalDialerBase.prototype._resetUser = function () {
  this.setUserProperty("voip_user", "", true);
  this.setUserProperty("voip_pin", "", true);
  this.setUserProperty("dial_context", "", true);
  this.settingsManager.setUserAndDialContext("", "", "");
  this.dialogManager.closeSettingsDialog();
  appCtxt.getAppController().setStatusMsg({msg: this.getMessage("successReset"), level: 1});
};
