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

function UniversalDialerStringUtils() {
}

UniversalDialerStringUtils.prototype.constructor = UniversalDialerStringUtils;

UniversalDialerStringUtils.prototype.getMessage = function (message) {
  if (typeof org_zetalliance_universaldialer !== "undefined" && org_zetalliance_universaldialer.hasOwnProperty(message)) {
    return org_zetalliance_universaldialer[message];
  }
  else {
    return message;
  }
};

UniversalDialerStringUtils.prototype.copyToClipboard = function (text) {
  if (window.clipboardData && window.clipboardData.setData) {
    clipboardData.setData("Text", text);
  } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy");
    } catch (ex) {
      appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("errFunctionNotEnabledInThisBrowser"), level: 3});
    } finally {
      document.body.removeChild(textarea);
    }
  } else {
    appCtxt.getAppController().setStatusMsg({msg: this.strUtl.getMessage("errFunctionNotEnabledInThisBrowser"), level: 3});
  }
};
