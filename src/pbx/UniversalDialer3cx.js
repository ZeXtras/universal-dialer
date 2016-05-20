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

function UniversalDialer3cx(zimlet) {
  UniversalDialerPbxBase.call(this);
  this.zimlet = zimlet;
  this.strUtl = new UniversalDialerStringUtils();
  // load custom global properties
  this._globalProperties = {
    name: this.zimlet.getConfig("server"),
    ip: this.zimlet.getConfig("serverIp"),
    actionTimeout: this.zimlet.getConfig("actionTimeout")
  };
}

UniversalDialer3cx.prototype = new UniversalDialerPbxBase();
UniversalDialer3cx.prototype.constructor = UniversalDialer3cx;

UniversalDialer3cx.prototype.getName = function () {
  // return custom name according to config_template.xml
  return "3cx";
};

UniversalDialer3cx.prototype.sendCall = function (callee) {
  // send originate call request to zimbra with custom api

  // Be careful!!! Works only on 3cx Phone System v12 and v12,5

  var query, url;
  query = "?func=make_call" +
    "&from=" + this.zimlet.getUserProperty("UDuserNumber") +
    "&pin=" + this.zimlet.getUserProperty("UDpin") +
    "&to=" + callee;
  url =
    ZmZimletBase.PROXY +
    AjxStringUtil.urlComponentEncode(
      "http://" +
      this._globalProperties.ip +
      ":5000/ivr/PbxAPI.aspx" +
      query
    );
  AjxRpc.invoke(
    null,
    url,
    null,
    new AjxCallback(
      this,
      this.manageResult
    ),
    "get"
  );
};

UniversalDialer3cx.prototype.validate = function (settings, callback) {
  // send originate call request to zimbra with custom api

  // Be careful!!! Works only on 3cx Phone System v12 and v12,5
  
  var userNumber = UniversalDialerPbxBase.extractPropertyValue(settings, "UDuserNumber"),
    pin = UniversalDialerPbxBase.extractPropertyValue(settings, "UDpin"),
    url,
    query,
    response;
  query = "?func=make_call" +
    "&from=" + userNumber +
    "&pin=" + pin +
    "&to=" + userNumber;
  url = ZmZimletBase.PROXY +
    AjxStringUtil.urlComponentEncode(
      "http://" +
      this._globalProperties.ip +
      ":5000/ivr/PbxAPI.aspx" +
      query
    );
  response = AjxRpc.invoke(
    null,
    url,
    null,
    null,
    "get"
  );
  callback.run(response.success);
};

UniversalDialer3cx.prototype.getUserProperties = function () {
  // load custom properties:
  //
  //    property constructor:
  //      - (string) property name according to a userProperty in org_zetalliance_universaldialer.xml
  //      - (string) user property value (get default value if user doesn't set in previous session)
  //      - (boolean) hide this property inside user view in both dialogs
  //      - (string) message shown in user view (if previous boolean is set to true, this parameter can be skipped)
  //      - (string) message that explain what user should insert in settings dialog
  //      - (string) layout of user property

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
