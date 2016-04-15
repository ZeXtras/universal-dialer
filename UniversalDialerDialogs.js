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

function UniversalDialerDialogs(viewManager) {
  this.viewManager = viewManager;
}
UniversalDialerDialogs.prototype.constructor = UniversalDialerDialogs;

UniversalDialerDialogs.prototype.createSettingsDialog = function (zimlet) {
  this.settingsDialog = new DwtDialog(
      {
        parent: appCtxt.getShell(),
        title: zimlet.getMessage("universalDialerSettings"),
        standardButtons: [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON],
        extraButtons: [new DwtDialog_ButtonDescriptor("reset_button",ZmMsg.reset, 1,new AjxListener(zimlet,zimlet._resetUser))]
      }
  );
  this.settingsDialog.popdown = function() {
    DwtBaseDialog.prototype.popdown.call(this);
    this.dispose();
  };
  var settingsCtrl, userGroup, userView;
  settingsCtrl = new DwtComposite({parent:this.settingsDialog});
    userGroup = new DwtGrouper(settingsCtrl);
    userGroup.setLabel(zimlet.getMessage("phoneGroupTitle"));
      userView = this.viewManager.createUserView(zimlet, userGroup);
    userGroup.setView(userView);
    this.viewManager.createSetView(zimlet, settingsCtrl);
  this.settingsDialog.setView(settingsCtrl);

  // Listeners
  this.settingsDialog.setButtonListener(
    DwtDialog.OK_BUTTON,
    new AjxListener(
      zimlet,
      zimlet._saveUserProperty
    )
  );
  this.settingsDialog.setButtonListener(
    DwtDialog.CANCEL_BUTTON,
    new AjxListener(
      this,
      this.closeSettingsDialog
    )
  );
  this.settingsDialog.setEnterListener(
    new AjxListener(
      zimlet,
      zimlet._saveUserProperty
    )
  );
  this.settingsDialog.popup();
};

UniversalDialerDialogs.prototype.closeSettingsDialog = function () {
  this.settingsDialog.popdown();
};

UniversalDialerDialogs.prototype.createCallDialog = function (zimlet, callee) {
  this.success = zimlet.getMessage("successCall");
  this.error = zimlet.getMessage("errServer");
  if (zimlet.getUserProperty("voip_user") == "") {
    zimlet.displayStatusMessage({msg: zimlet.getMessage("sourcePhoneNotSet"), level: 2});
    this.createSettingsDialog(zimlet);
  } else {
    this.callDialog = new DwtDialog(
      {
        parent: appCtxt.getShell(),
        title: zimlet.getMessage("originateCall"),
        standardButtons: [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]
      }
    );
    this.callDialog.popdown = function() {
      DwtBaseDialog.prototype.popdown.call(this);
      this.dispose();
    };
    var callCtrl, userGroup, userView, callGroup, callView;
    callCtrl = new DwtComposite({parent:this.callDialog});
      userGroup = new DwtGrouper(callCtrl);
      userGroup.setLabel(zimlet.getMessage("phoneGroupTitle"));
        userView = this.viewManager.createUserView(zimlet, userGroup);
      userGroup.setView(userView);
      callGroup = new DwtGrouper(callCtrl);
      callGroup.setLabel(zimlet.getMessage("destGroupTitle"));
        callView = this.viewManager.createCallView(zimlet, callGroup, callee);
      callGroup.setView(callView);
    this.callDialog.setView(callCtrl);

    // Listeners
    this.callDialog.setButtonListener(
      DwtDialog.OK_BUTTON,
      new AjxListener(
        zimlet,
        zimlet._sendCall
      )
    );
    this.callDialog.setButtonListener(
      DwtDialog.CANCEL_BUTTON,
      new AjxListener(
        this,
        this.closeCallDialog
      )
    );
    this.callDialog.setEnterListener(
      new AjxListener(
        zimlet,
        zimlet._sendCall
      )
    );
    this.callDialog.popup();
  }
};

UniversalDialerDialogs.prototype.manageResult = function (result) {
  if (result.success){
    appCtxt.getAppController().setStatusMsg({msg: this.success, level: 1});
  } else {
    appCtxt.getAppController().setStatusMsg({msg: this.error, level: 3});
  }  
  this.closeCallDialog();
};

UniversalDialerDialogs.prototype.closeCallDialog = function () {
  this.callDialog.popdown();
};