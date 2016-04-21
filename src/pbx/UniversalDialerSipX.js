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

function UniversalDialerSipX(zimlet) {
  UniversalDialerPbxBase.call(this);
  this.zimlet = zimlet;
  this.strUtl = new UniversalDialerStringUtils();
  this._globalProperties = {
    name: this.zimlet.getConfig("server"),
    ip: this.zimlet.getConfig("serverIp"),
    actionTimeout: this.zimlet.getConfig("actionTimeout")
  };
}

UniversalDialerSipX.prototype = new UniversalDialerPbxBase();
UniversalDialerSipX.prototype.constructor = UniversalDialerSipX;

UniversalDialerSipX.prototype.getName = function () {
  return "sipX";
};

UniversalDialerSipX.prototype.sendCall = function (callee) {
  var query, url, sipAuth = [];
  sipAuth.Authorization = "Basic " + Base64.encode(this.zimlet.getUserProperty("UDuserNumber") + ":" + this.zimlet.getUserProperty("UDpin"));
  query =
    this.zimlet.getUserProperty("UDuserNumber") +
    "/" + callee +
    "?timeout=" + this._globalProperties.actionTimeout;
  url =
    location.protocol + "//null:null@" +
    location.host + ":" + location.port +
    ZmZimletBase.PROXY +
    AjxStringUtil.urlComponentEncode(
      "https://" +
      this._globalProperties.ip +
      "/sipxconfig/rest/my/redirect/callcontroller/" +
      query
    );
  AjxRpc.invoke(
    null,
    url,
    sipAuth,
    new AjxCallback(
      this,
      this.manageResult
    )
  );
};

UniversalDialerSipX.prototype.validate = function (settings) {
  var userNumber = UniversalDialerPbxBase.extractPropertyValue(settings, "UDuserNumber"),
    pin = UniversalDialerPbxBase.extractPropertyValue(settings, "UDpin"),
    url,
    sipAuth = [],
    response;

  sipAuth.Authorization = "Basic " + Base64.encode(userNumber + ":" + pin);
  url =
    location.protocol + "//null:null@" +
    location.host + ":" + location.port +
    ZmZimletBase.PROXY +
    AjxStringUtil.urlComponentEncode(
      "https://" + this._globalProperties.ip + "/sipxconfig/rest/my/logindetails"
    );
  response = AjxRpc.invoke(
    null,
    url,
    sipAuth,
    null,
    "get"
  );
  return response.success;
};

UniversalDialerSipX.prototype.getUserProperties = function () {
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
    "UDpin",
    this.zimlet.getUserProperty("UDpin"),
    true,
    "",
    this.strUtl.getMessage("UDpinInput"),
    UniversalDialerProperty.INPUT_FIELD
  ));

  return _userProperties;
};
