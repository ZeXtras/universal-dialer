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

package org.zetalliance.universaldialer;

import org.asteriskjava.manager.ManagerConnection;
import org.asteriskjava.manager.ManagerConnectionFactory;
import org.asteriskjava.manager.ManagerConnectionState;
import org.asteriskjava.manager.action.CommandAction;
import org.asteriskjava.manager.action.OriginateAction;
import org.asteriskjava.manager.response.CommandResponse;
import org.asteriskjava.manager.response.ManagerResponse;
import org.openzal.zal.Provisioning;
import org.openzal.zal.soap.*;

/**
 * SOAP Handler to interface a class which act as a client, with the SOAP infrastructure.
 */
public class AsteriskSoapHandler implements SoapHandler
{
    private static final String NAMESPACE = "urn:zimbraAccount";
    public static final QName REQUEST_QNAME = new QName("AsteriskDialerRequest", NAMESPACE);

    private final Provisioning mProvisioning;

    public AsteriskSoapHandler(Provisioning provisioning)
    {
        mProvisioning = provisioning;
    }

    /**
     * Handle a SOAP request.
     * @param zimbraContext The zimbra contest
     * @param soapResponse The response container for the SOAP request
     * @param zimbraExceptionContainer
     */
    @Override
    public void handleRequest(
            ZimbraContext zimbraContext,
            SoapResponse soapResponse,
            ZimbraExceptionContainer zimbraExceptionContainer
    )
    {
        mProvisioning.getZimlet("org_zetalliance_universaldialer").getAttr("");
        long timeout = Long.parseLong(zimbraContext.getParameter("timeout","30")) * 1000L;
        ManagerConnection managerConnection;
        int port;

        try {
            port=Integer.parseInt(zimbraContext.getParameter("managerPort", ""));
        } catch (NumberFormatException e) {
            port=5038;
        }

        ManagerConnectionFactory mCF= new ManagerConnectionFactory(
                zimbraContext.getParameter("managerIp", ""),
                port ,
                zimbraContext.getParameter("managerUser", ""),
                zimbraContext.getParameter("managerSecret", "")
        );

        managerConnection = mCF.createManagerConnection();
        String user = zimbraContext.getParameter("user", "");
        String pin = zimbraContext.getParameter("pin", "");
        soapResponse.setValue("success",false);
        try {
            if (user != null && pin != null) {
                if (managerConnection == null) {
                    soapResponse.setValue("text", "Asterisk Manager Connection error");
                } else {
                    managerConnection.login("off");
                    CommandAction action = new CommandAction();
                    action.setCommand("sip show users");
                    ManagerResponse response = managerConnection.sendAction(action, timeout + 10);
                    if(response instanceof CommandResponse) {
                        CommandResponse authResponse = (CommandResponse) response;
                        for (String row : authResponse.getResult()) {
                            String[] array = row.split("\\s+");
                            if (array[0].equals(user) && array[1].substring(0,15).equals(pin.substring(0,15)) && !array[4].equals("ACL")) {
                                // successful authentication then:
                                String callee = zimbraContext.getParameter("callee", "");
                                if (callee.length() == 0) {
                                    // callee empty => only validation
                                    soapResponse.setValue("success", true);
                                } else {
                                    // callee not empty => validation and send call
                                    OriginateAction actionCall = new OriginateAction();
                                    actionCall.setChannel(zimbraContext.getParameter("dialChannelType", "") + "/" + user);
                                    actionCall.setContext(zimbraContext.getParameter("dialContext", ""));
                                    actionCall.setExten(callee);
                                    actionCall.setCallerId(callee + " <" + user + ">");
                                    actionCall.setPriority(1);
                                    actionCall.setTimeout(timeout);
                                    ManagerResponse responseCall = managerConnection.sendAction(actionCall, timeout + 10);
                                    soapResponse.setValue("text", responseCall.getMessage());
                                    soapResponse.setValue("success", true);
                                }
                            }
                        }
                    }
                }
            } else {
                soapResponse.setValue("text", "Phone source or phone destination not valid");
                handleError(
                        new RuntimeException("User or pin not valid"),
                        soapResponse,
                        zimbraExceptionContainer
                );
            }
        } catch (Exception ex) {
            soapResponse.setValue("text", "Error while connecting to server");
        }

        if (managerConnection != null &&
            (managerConnection.getState() == ManagerConnectionState.CONNECTED || managerConnection.getState() == ManagerConnectionState.RECONNECTING)) {
            managerConnection.logoff();
        }
    }

    /**
     * Encode an error into a JSON Object.
     * @param error The error which will be encoded.
     * @param resp The response container
     */
    private static void handleError(
            Exception error,
            SoapResponse resp,
            ZimbraExceptionContainer errorContainer
    )
    {
        resp.setValue("error", String.valueOf(error));
        resp.setValue("success", false);
        errorContainer.setException(error);
    }

    /**
     * If the user needs to be authenticated as admin to use this handler.
     * @param zimbraContext The zimbra context.
     * @return If the user needs to be an administrator.
     */
    @Override
    public boolean needsAdminAuthentication(
            ZimbraContext zimbraContext
    )
    {
        return false;
    }

    /**
     * If the user needs to be authenticated to use this handler.
     * @param zimbraContext The zimbra context.
     * @return If the user needs to be authenticated.
     */
    @Override
    public boolean needsAuthentication(
            ZimbraContext zimbraContext
    )
    {
        return true;
    }
}