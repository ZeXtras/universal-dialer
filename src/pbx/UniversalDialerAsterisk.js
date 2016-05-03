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
  // load custom global properties
  this._globalProperties = {
    name: this.zimlet.getConfig("server"),
    ip: this.zimlet.getConfig("serverIp"),
    actionTimeout: this.zimlet.getConfig("actionTimeout"),

    serverAdminUser: this.zimlet.getConfig("serverAdminUser"),
    serverAdminSecret: this.zimlet.getConfig("serverAdminSecret"),
    managerPort: this.zimlet.getConfig("managerPort"),
    dialChannel: this.zimlet.getConfig("dialChannel")
  };
}

UniversalDialerAsterisk.prototype = new UniversalDialerPbxBase();
UniversalDialerAsterisk.prototype.constructor = UniversalDialerAsterisk;

UniversalDialerAsterisk.prototype.getName = function () {
  // return custom name according to config_template.xml
  return "asterisk";
};

UniversalDialerAsterisk.prototype.sendCall = function (callee) {
  var soapDoc = AjxSoapDoc.create("AsteriskDialerRequest", "urn:zimbraAccount");
  soapDoc.set("managerIp", this._globalProperties.ip);
  soapDoc.set("timeout", this._globalProperties.actionTimeout);
  soapDoc.set("managerPort", this._globalProperties.managerPort);
  soapDoc.set("managerUser", this._globalProperties.serverAdminUser);
  soapDoc.set("managerSecret", this._globalProperties.serverAdminSecret);
  soapDoc.set("dialChannelType", this._globalProperties.dialChannel);
  soapDoc.set("dialContext", this.zimlet.getUserProperty("UDcontext"));
  soapDoc.set("user", this.zimlet.getUserProperty("UDuserNumber"));
  soapDoc.set("pin", this.zimlet.getUserProperty("UDpin"));
  soapDoc.set("callee", callee);

  var params = {
    soapDoc: soapDoc,
    asyncMode: true,
    callback: new AjxCallback(this, this.manageResult),
    errorCallback: new AjxCallback(this, this.manageResult)
  };

  appCtxt.getAppController().sendRequest(params);
  appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("successRequestSend"), level: 1});
};

UniversalDialerAsterisk.prototype.validate = function (settings, callback) {
  var userNumber = UniversalDialerPbxBase.extractPropertyValue(settings, "UDuserNumber"),
    pin = UniversalDialerPbxBase.extractPropertyValue(settings, "UDpin");
  
  var soapDoc = AjxSoapDoc.create("AsteriskDialerRequest", "urn:zimbraAccount");
  soapDoc.set("managerIp", this._globalProperties.ip);
  soapDoc.set("timeout", this._globalProperties.actionTimeout);
  soapDoc.set("managerPort", this._globalProperties.managerPort);
  soapDoc.set("managerUser", this._globalProperties.serverAdminUser);
  soapDoc.set("managerSecret", this._globalProperties.serverAdminSecret);
  soapDoc.set("pin", pin);
  soapDoc.set("user", userNumber);

  var params = {
    soapDoc: soapDoc,
    asyncMode: true,
    callback: callback,
    errorCallback: new AjxCallback(
      this,
      function () {
        appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("errServer"), level: 3});
      }
    )
  };

  appCtxt.getAppController().sendRequest(params);
  appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("successRequestSend"), level: 1});
};

UniversalDialerAsterisk.prototype.getUserProperties = function () {
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

UniversalDialerAsterisk.prototype.manageResult = function (result) {
// Override of default UniversalDialerPbxBase.manageResult function
// Asterisk receive a SOAP response and must be handled in a different way
  if (result.getResponse().response.success) {
    if (result.getResponse().response.text === "Originate failed") {
      appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("errServerProblem"), level: 2});
    } else {
      appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("successCall"), level: 1});
    }
  } else {
    appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("errServer"), level: 3});
  }
};
