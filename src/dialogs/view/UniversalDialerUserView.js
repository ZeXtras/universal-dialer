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

function UniversalDialerUserView(parent) {
  DwtComposite.call(this, {parent: parent});
}

UniversalDialerUserView.prototype = new DwtComposite();
UniversalDialerUserView.prototype.constructor = UniversalDialerUserView;

UniversalDialerUserView.prototype.updateView = function (properties) {
  this.removeChildren();
  for (var index = 0; index < properties.length; index += 1) {
    if (!properties[index].isHidden()) {
      this._addRow(properties[index]);
    }
  }
};

UniversalDialerUserView.prototype._addRow = function (property) {
  var toolbar = new DwtToolBar({parent: this});
  var label = new DwtLabel({parent: toolbar});
  label.setText(property.getLabel());
  label.setSize(200, 24);
  var labelValue = new DwtLabel({parent: toolbar});
  labelValue.setText(property.getValue());
};
