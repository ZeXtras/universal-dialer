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

function UniversalDialerCallView(parent) {
  var strUtl = new UniversalDialerStringUtils();
  DwtComposite.call(this, {parent: parent});
  var callPhoneToolbar = new DwtToolBar({parent: this});
  var callPhoneLabel = new DwtLabel({parent: callPhoneToolbar});
  callPhoneLabel.setText(strUtl.getMessage("numberToCall"));
  callPhoneLabel.setSize(200, 24);
  this.callInputField = new DwtInputField({parent: callPhoneToolbar, className: "DwtInputField", initialValue: ""});
}

UniversalDialerCallView.prototype = new DwtComposite();
UniversalDialerCallView.prototype.constructor = UniversalDialerCallView;

UniversalDialerCallView.prototype.getInputValue = function () {
  return this.callInputField.getValue();
};

UniversalDialerCallView.prototype.setInputValue = function (value) {
  this.callInputField.setValue(value)
};

UniversalDialerCallView.prototype.resetInputValue = function () {
  this.callInputField.setValue("");
};
