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

function UniversalDialerConnection() {}
UniversalDialerConnection.prototype.constructor = UniversalDialerConnection;

UniversalDialerConnection.prototype.checkUser = function (voipUser,pin, server, successMsg, errorMsg) {
  /*
      TODO: integrate check with every pbx
      then TODO: move status messages to UniversalDialerBase
   */
  var url, sipAuth, response, query;
  switch (server.name) {
    case "sipX" : {
      sipAuth = [];
      sipAuth.Authorization = "Basic " + Base64.encode(voipUser + ":" + pin);
      url = "https://null:null@" + location.host + ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode("https://" + server.ip + "/sipxconfig/rest/my/logindetails");
      response = AjxRpc.invoke(
        null,
        url,
        sipAuth,
        null,
        "get"
      );
      if (response.success) {
        appCtxt.getAppController().setStatusMsg({msg: successMsg, level: 1});
        return true;
      }
      else {
        appCtxt.getAppController().setStatusMsg({msg: errorMsg, level: 3});
        return false
      }
    }
    case "3cx" : {
      /*
        Test with make call to same number, not sure it works
       */
      url = ZmZimletBase.PROXY + "http://" + server.ip + "/ivr/PbxAPI.aspx";
      query = "?func=make_call" +
        "&from=" + voipUser +
        "&pin=" + pin;
      response = AjxRpc.invoke(
        null,
        url + query + "&to=" + voipUser,
        null,
        new AjxCallback(dialogManager, dialogManager.manageResult)
      );
      if (response.success) {
        appCtxt.getAppController().setStatusMsg({msg: successMsg, level: 1});
        return true;
      }
      else {
        appCtxt.getAppController().setStatusMsg({msg: errorMsg, level: 3});
        return false
      }
    }
    default : {
      return true
    }
  }
};

UniversalDialerConnection.prototype.sendCall = function (callee, dialogManager, server, config) {
  switch (server.name) {
    case "asterisk" :   {this.sendCallAsterisk(callee, dialogManager, server, config);    break}
    case "sipX" :       {this.sendCallSipX(callee, dialogManager, server, config);        break}
    case "3cx" :        {this.sendCall3cx(callee, dialogManager, server, config);         break}
    case "metaSwitch" : {this.sendCallMetaSwitch(callee, dialogManager, server, config);  break}
  }
};

UniversalDialerConnection.prototype.sendCallAsterisk = function (callee, dialogManager, server, config) {
  var url, query;
  url = config.asteriskJsp;
  query = "?managerIp=" + server.ip +
    "&timeout=" + server.actionTimeout +
    "&managerPort=" + config.managerPort +
    "&managerUser=" + config.asteriskAuth.adminUser +
    "&managerSecret=" + config.asteriskAuth.adminSecret +
    "&dialChannelType=" + config.dialChannel +
    "&dialContext=" + config.dialContext +
    "&caller=" + config.localUser;
  AjxRpc.invoke(
    null,
    url + query + "&callee=" + callee,
    null,
    new AjxCallback(dialogManager, dialogManager.manageResult)
  );
};

UniversalDialerConnection.prototype.sendCallSipX = function (callee, dialogManager, server, config) {
  var url, query, sipAuth = [];
  sipAuth.Authorization = "Basic " + Base64.encode(config.localUser + ":" + config._voipUserPin);
  url = "https://null:null@" + location.host + ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode("https://" + server.ip + "/sipxconfig/rest/my/redirect/callcontroller/");
  query = config.localUser + "/" + callee + "?timeout=" + server.actionTimeout;
  AjxRpc.invoke(
    null,
    url + query,
    sipAuth,
    new AjxCallback(dialogManager, dialogManager.manageResult)
  );
};

UniversalDialerConnection.prototype.sendCall3cx = function (callee, dialogManager, server, config) {
  /*
    TODO: need tests
   */
  var url, query;
  url = ZmZimletBase.PROXY + "http://" + server.ip + "/ivr/PbxAPI.aspx";
  query = "?func=make_call" +
    "&from=" + config.localUser +
    "&pin=" + config._voipUserPin;
  AjxRpc.invoke(
    null,
    url + query + "&to=" + callee,
    null,
    new AjxCallback(dialogManager, dialogManager.manageResult)
  );
};

UniversalDialerConnection.prototype.sendCallMetaSwitch = function (callee, dialogManager, server, config) {
  /*
   TODO: need tests
   */
  var url, login, requestString, makeCall;
  url = ZmZimletBase.PROXY + "https://" + server.ip + "/";
  login = "login?version=9.0" +
    "&DirectoryNumber=" + config.localUser +
    "&Password=" + config._voipUserPin;
  requestString =
    "{objectType:{_:'Meta_CSTA_MakeCall'}," +
    "callingDevice:{_:'"+config.localUser+"'}," +
    "calledDirectoryNumber:{_:'"+callee+"'}," +
    "autoOriginate:{_:'prompt'}," +
    "callCharacteristics:{assistCall:{_:false}}}";
  AjxRpc.invoke(
    null,
    url + login,
    null,
    new AjxCallback(
      this,
      function (result) {
        makeCall = "session" + result.text + "/line/action?version9.0";
        AjxRpc.invoke(
          requestString,
          url + makeCall,
          null,
          new AjxCallback(
            dialogManager,
            dialogManager.manageResult
          )
        );
      })
  );
};