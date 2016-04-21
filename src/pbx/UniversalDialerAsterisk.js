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

function UniversalDialerAsterisk(zimlet) {
  UniversalDialerPbxBase.call(this);
  this.zimlet = zimlet;
  this.strUtl = new UniversalDialerStringUtils();
  this._globalProperties = {
    name: this.zimlet.getConfig("server"),
    ip: this.zimlet.getConfig("serverIp"),
    actionTimeout: this.zimlet.getConfig("actionTimeout"),

    serverAdminUser: this.zimlet.getConfig("serverAdminUser"),
    serverAdminSecret: this.zimlet.getConfig("serverAdminSecret"),
    managerPort: this.zimlet.getConfig("managerPort"),
    dialChannel: this.zimlet.getConfig("dialChannel")
  };
  this._jspPath = this.zimlet.getResource("UniversalDialer.jsp");
}

UniversalDialerAsterisk.prototype = new UniversalDialerPbxBase();
UniversalDialerAsterisk.prototype.constructor = UniversalDialerAsterisk;

UniversalDialerAsterisk.prototype.getName = function () {
  return "asterisk";
};

UniversalDialerAsterisk.prototype.sendCall = function (callee) {
  var url, query;
  url = this._jspPath;
  query = "?managerIp=" + this._globalProperties.ip +
    "&timeout=" + this._globalProperties.actionTimeout +
    "&managerPort=" + this._globalProperties.managerPort +
    "&managerUser=" + this._globalProperties.serverAdminUser +
    "&managerSecret=" + this._globalProperties.serverAdminSecret +
    "&dialChannelType=" + this._globalProperties.dialChannel +
    "&dialContext=" + this.zimlet.getUserProperty("UDcontext") +
    "&caller=" + this.zimlet.getUserProperty("UDuserNumber");
  AjxRpc.invoke(
    null,
    url + query + "&callee=" + callee,
    null,
    new AjxCallback(
      this,
      this.manageResult
    )
  );
};

UniversalDialerAsterisk.prototype.validate = function (settings) {
  var userNumber = UniversalDialerPbxBase.extractPropertyValue(settings, "UDuserNumber");
  /**
   *  TODO: find a way to validate asterisk number
   */
  return true;
};

UniversalDialerAsterisk.prototype.getUserProperties = function () {
  var _userProperties = [];

  _userProperties.push(new UniversalDialerProperty(
    "UDuserNumber",
    this.zimlet.getUserProperty("UDuserNumber"),
    false,
    this.strUtl.getMessage("UDuserNumber"),
    this.strUtl.getMessage("UDuserNumberInput"),
    UniversalDialerProperty.INPUT_FIELD
  ));

  _userProperties.push(new UniversalDialerProperty(
    "UDcontext",
    this.zimlet.getUserProperty("UDcontext"),
    false,
    this.strUtl.getMessage("UDcontext"),
    this.strUtl.getMessage("UDcontextInput"),
    UniversalDialerProperty.INPUT_FIELD
  ));

  return _userProperties;
};
