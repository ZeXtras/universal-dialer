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

function UniversalDialerSettingsDialog(zimlet, pbxMgr) {
  this.zimlet = zimlet;
  this.pbxMgr = pbxMgr;
  this.strUtl = new UniversalDialerStringUtils();
  var params = {
    parent: appCtxt.getShell(),
    title: this.strUtl.getMessage("universalDialerSettings"),
    standardButtons: [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON],
    extraButtons: [
      new DwtDialog_ButtonDescriptor(
        "reset_button",
        ZmMsg.reset,
        1,
        new AjxListener(
          this,
          this._resetUserProperties
        )
      )
    ]
  };

  DwtDialog.call(this, params);

  var settingsCtrl = new DwtComposite({parent: this});

  this._userGroup = new DwtGrouper(settingsCtrl);
  this._userGroup.setLabel(this.strUtl.getMessage("phoneGroupTitle"));
  this._userView = new UniversalDialerUserView(this._userGroup);
  this._userGroup.setView(this._userView);

  this._settingsGroup = new DwtGrouper(settingsCtrl);
  this._settingsGroup.setLabel(this.strUtl.getMessage("phoneGroupTitle"));
  this._settingsView = new UniversalDialerSettingsView(this._settingsGroup, this._tabGroup);
  this._settingsGroup.setView(this._settingsView);


  this.setView(settingsCtrl);

  // Listeners
  this.setButtonListener(
    DwtDialog.OK_BUTTON,
    new AjxListener(
      this,
      this._checkAuthentication
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
      this._checkAuthentication
    )
  );
}

UniversalDialerSettingsDialog.prototype = new DwtDialog();
UniversalDialerSettingsDialog.prototype.constructor = UniversalDialerSettingsDialog;

UniversalDialerSettingsDialog.prototype.popup = function () {
  this.managedProperties = this.pbxMgr.getPbxSettings();
  if (this.managedProperties.length !== 0) {
    this._userView.updateView(this.managedProperties);
    this._settingsView.updateView(this.managedProperties);
    DwtDialog.prototype.popup.call(this);
  }
};

UniversalDialerSettingsDialog.prototype._saveUserProperties = function (result) {
  var check = result;
  if (typeof result.getResponse === "function") {
    check = result.getResponse().response.success;
  }

  if (check) {
    for (var index = 0; index < this.managedProperties.length; index += 1) {
      this.zimlet.setUserProperty(this.managedProperties[index].getName(), this.managedProperties[index].getValue(), true)
    }
    this.popdown();
    appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("successCheckAuth"), level: 1});
  } else {
    appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("errCheckAuth"), level: 3});
  }
};

UniversalDialerSettingsDialog.prototype._checkAuthentication = function () {
  for (var index = 0; index < this.managedProperties.length; index += 1) {
    switch (this.managedProperties[index].getInputType()) {
      case UniversalDialerProperty.INPUT_FIELD :
      {
        this.managedProperties[index].setValue(this._settingsView.getInputFieldValue(this.managedProperties[index].getName()));
        break;
      }
      case UniversalDialerProperty.CHECKBOX :
      {
        this.managedProperties[index].setValue(this._settingsView.getCheckboxSelected(this.managedProperties[index].getName()));
        break;
      }
    }
  }

  if (this._settingsView.checkInputFieldsNotEmpty()) {
    this.pbxMgr.validateNumber(
      this.managedProperties,
      new AjxCallback(
        this,
        this._saveUserProperties
      )
    );
  } else {
    appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("inputFieldEmptyInSettings"), level: 2});
  }
};

UniversalDialerSettingsDialog.prototype._resetUserProperties = function () {
  for (var index = 0; index < this.managedProperties.length; index += 1) {
    this.zimlet.setUserProperty(this.managedProperties[index].getName(), "", true)
  }
  this.popdown();
  appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("successReset"), level: 1});
};
