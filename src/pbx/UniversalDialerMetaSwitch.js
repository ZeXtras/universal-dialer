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

function UniversalDialerMetaSwitch(zimlet) {
  UniversalDialerPbxBase.call(this);
  this.zimlet = zimlet;
  this.strUtl = new UniversalDialerStringUtils();
  this._globalProperties = {
    name: this.zimlet.getConfig("server"),
    ip: this.zimlet.getConfig("serverIp"),
    actionTimeout: this.zimlet.getConfig("actionTimeout")
  };
}

UniversalDialerMetaSwitch.prototype = new UniversalDialerPbxBase();
UniversalDialerMetaSwitch.prototype.constructor = UniversalDialerMetaSwitch;

UniversalDialerMetaSwitch.prototype.getName = function () {
  return "metaSwitch";
};

UniversalDialerMetaSwitch.prototype.sendCall = function (callee) {
  /*
   TODO: need tests
   */
  var url, login, requestString, makeCall;
  login = "login?version=9.0" +
    "&DirectoryNumber=" + this.zimlet.getUserProperty("UDuserNumber") +
    "&Password=" + this.zimlet.getUserProperty("UDpin");
  requestString =
    "{objectType:{_:'Meta_CSTA_MakeCall'}," +
    "callingDevice:{_:'" + this.zimlet.getUserProperty("UDuserNumber") + "'}," +
    "calledDirectoryNumber:{_:'" + callee + "'}," +
    "autoOriginate:{_:'prompt'}," +
    "callCharacteristics:{assistCall:{_:false}}}";
  url = ZmZimletBase.PROXY +
    AjxStringUtil.urlComponentEncode(
      "https://" + this._globalProperties.ip + "/" +
      login
    );
  
  var finalCallback = new AjxCallback(
    this,
    this.manageResult
  );

  AjxRpc.invoke(
    null,
    url,
    null,
    new AjxCallback(
      this,
      function (result) {
        makeCall = "session" + result.text + "/line/action?version9.0";
        AjxRpc.invoke(
          requestString,
          url + makeCall,
          null,
          finalCallback
        );
      }
    )
  );
};

UniversalDialerMetaSwitch.prototype.validate = function (settings) {
  var userNumber = UniversalDialerPbxBase.extractPropertyValue(settings, "UDuserNumber"),
    pin = UniversalDialerPbxBase.extractPropertyValue(settings, "UDpin");

  /**
   *  TODO: find a way to validate metaswitch number
   */
  return true;
};

UniversalDialerMetaSwitch.prototype.getUserProperties = function () {
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
