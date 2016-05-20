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
 *
 * @param {string} name
 * @param {string} value
 * @param {boolean} hidden
 * @param {string} label
 * @param {string} inputLabel
 * @param {string} dwtInputType
 * @constructor
 */
function UniversalDialerProperty(name, value, hidden, label, inputLabel, dwtInputType) {
  this.name = name;
  this.value = value;
  this.hidden = hidden;
  this.label = label;
  this.inputLabel = inputLabel;
  this.dwtInputType = dwtInputType;
}

UniversalDialerProperty.INPUT_FIELD = "inputField";
UniversalDialerProperty.CHECKBOX = "checkbox";

UniversalDialerProperty.prototype.getName = function () {
  return this.name;
};

UniversalDialerProperty.prototype.getValue = function () {
  return this.value;
};

UniversalDialerProperty.prototype.isHidden = function () {
  return this.hidden;
};

UniversalDialerProperty.prototype.getLabel = function () {
  return this.label;
};

UniversalDialerProperty.prototype.getInputLabel = function () {
  return this.inputLabel;
};

UniversalDialerProperty.prototype.getInputType = function () {
  return this.dwtInputType;
};

UniversalDialerProperty.prototype.setValue = function (value) {
  this.value = value;
};
