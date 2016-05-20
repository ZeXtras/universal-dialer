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

function UniversalDialerCallDialog(pbxMgr) {
  this.pbxMgr = pbxMgr;
  this.strUtl = new UniversalDialerStringUtils();
  var params = {
    parent: appCtxt.getShell(),
    title: this.strUtl.getMessage("originateCall"),
    standardButtons: [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]
  };

  DwtDialog.call(this, params);

  var callCtrl = new DwtComposite({parent: this});

  this._userGroup = new DwtGrouper(callCtrl);
  this._userGroup.setLabel(this.strUtl.getMessage("phoneGroupTitle"));

  this._callGroup = new DwtGrouper(callCtrl);
  this._callGroup.setLabel(this.strUtl.getMessage("destGroupTitle"));
  this._callView = new UniversalDialerCallView(this._callGroup);
  this._callGroup.setView(this._callView);

  this._userView = new UniversalDialerUserView(this._userGroup);
  this._userGroup.setView(this._userView);

  this.setView(callCtrl);

  // Listeners
  this.setButtonListener(
    DwtDialog.OK_BUTTON,
    new AjxListener(
      this,
      this.sendCall
    )
  );
  this.setButtonListener(
    DwtDialog.CANCEL_BUTTON,
    new AjxListener(
      this,
      this.popdown
    )
  );
  this.setEnterListener(
    new AjxListener(
      this,
      this.sendCall
    )
  );
}

UniversalDialerCallDialog.prototype = new DwtDialog();
UniversalDialerCallDialog.prototype.constructor = UniversalDialerCallDialog;

UniversalDialerCallDialog.prototype.popup = function () {
  var managedProperties = this.pbxMgr.getPbxSettings();
  if (managedProperties.length !== 0) {
    this._userView.updateView(managedProperties);
    this._callView.resetInputValue();
    DwtDialog.prototype.popup.call(this);
  }
};

UniversalDialerCallDialog.prototype.sendCall = function () {
  var callee = this._callView.getInputValue();
  if (callee != "") {
    this.pbxMgr.sendCall(this._callView.getInputValue());
    this.popdown();
  } else {
    appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("destPhoneEmpty"), level: 2});
  }
};
