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

function UniversalDialerSettingsView(parent) {
  DwtComposite.call(this, {parent: parent});
}

UniversalDialerSettingsView.prototype = new DwtComposite();
UniversalDialerSettingsView.prototype.constructor = UniversalDialerSettingsView;

UniversalDialerSettingsView.KEY_SETTING_ID = "settingId";

UniversalDialerSettingsView.prototype._addInputFieldRow = function (property) {
  var toolbar = new DwtToolBar({parent: this});
  var label = new DwtLabel({parent: toolbar});
  label.setText(property.getInputLabel());
  label.setSize(200, 24);
  var inputField = new DwtInputField({
    parent: toolbar,
    className: "DwtInputField",
    initialValue: ""
  });
  inputField.setData(
    UniversalDialerSettingsView.KEY_SETTING_ID,
    property.getName()
  );
  this._inputFields.push(inputField);
};

UniversalDialerSettingsView.prototype.getInputFieldValue = function (propertyName) {
  for (var index = 0; index < this._inputFields.length; index += 1) {
    if (this._inputFields[index].getData(UniversalDialerSettingsView.KEY_SETTING_ID) === propertyName) {
      return this._inputFields[index].getValue();
    }
  }
};

UniversalDialerSettingsView.prototype.updateView = function (properties) {
  this._inputFields = [];
  this.removeChildren();
  for (var i = 0; i < properties.length; i += 1) {
    if (properties[i].getInputType() === UniversalDialerProperty.INPUT_FIELD) {
      this._addInputFieldRow(properties[i]);
    }
  }
};
