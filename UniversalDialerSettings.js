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

function UniversalDialerSettings(zimlet) {
  this.loadServerInfo(zimlet);
  this.loadConfig(zimlet);
}
UniversalDialerSettings.prototype.constructor = UniversalDialerSettings;

UniversalDialerSettings.prototype.loadServerInfo = function (zimlet) {
  this.server = {
    name: zimlet.getConfig("server"),
    ip: zimlet.getConfig("serverIp"),
    actionTimeout: zimlet.getConfig("actionTimeout")
  }
};

UniversalDialerSettings.prototype.loadConfig = function(zimlet) {
  var config = {};
  // Global Config
  config.localUser = zimlet.getUserProperty("voip_user") ? zimlet.getUserProperty("voip_user") : "";
  switch (this.server.name) {
    case "asterisk" : {
      config.managerPort = (zimlet.getConfig("managerPort") !== "") ? zimlet.getConfig("managerPort") : "5038";
      config.dialChannel = (zimlet.getConfig("dialChannel") !== "") ? zimlet.getConfig("dialChannel") : "SIP";
      config.asteriskAuth = {};
      config.asteriskAuth.adminUser = zimlet.getConfig("serverAdminUser");
      config.asteriskAuth.adminSecret = zimlet.getConfig("serverAdminSecret");
      config.asteriskJsp = zimlet.getResource("UniversalDialer.jsp");
      config.dialContext = zimlet.getUserProperty("dial_context") ? zimlet.getUserProperty("dial_context") : zimlet.getConfig("dialContext");
      break
    }
    case "sipX" : 
    case "3cx" : 
    case "metaswitch" : {
      config._voipUserPin = zimlet.getUserProperty("voip_pin") ? zimlet.getUserProperty("voip_pin") : "";
      break
    }
    default : {
      appCtxt.getAppController().setStatusMsg({msg: zimlet.getMessage("errServerUnknown"), level: 3});
    }
  }
  this.config = config;
};

UniversalDialerSettings.prototype.setUserAndDialContext = function (user, _pin, dialContext) {
  this.config.localUser = user;
  this.config._voipUserPin = _pin;
  this.config.dialContext = dialContext;
};

UniversalDialerSettings.prototype.getServerInfo = function () {
  return this.server;
};

UniversalDialerSettings.prototype.getSettings = function () {
  return this.config;
};
