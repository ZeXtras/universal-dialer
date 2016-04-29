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
package asterisk;

import org.asteriskjava.manager.ManagerConnection;
import org.asteriskjava.manager.ManagerConnectionFactory;
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

        long timeout = Long.parseLong(zimbraContext.getParameter("timeout","30000")) * 1000L;
        String command = zimbraContext.getParameter("command", "authenticate");
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
        soapResponse.setValue("success",false);

        switch (command)
        {
            case "authenticate": {
                String user = zimbraContext.getParameter("user", "");
                String pin = zimbraContext.getParameter("pin", "");
                if (user != null && pin != null) {
                    CommandAction action = new CommandAction();
                    action.setCommand("sip show users");
                    CommandResponse response;
                    try {
                        if (managerConnection == null) {
                            soapResponse.setValue("text", "ManagerConnection is null");
                        } else {
                            managerConnection.login("off");
                            response = (CommandResponse) managerConnection.sendAction(action, timeout + 10);
                            for (String row : response.getResult()) {
                                String[] array = row.split("\\s+");
                                if (user.equals(array[0]) && pin.equals(array[1])) {
                                    soapResponse.setValue("success", true);
                                }
                            }
                            managerConnection.logoff();
                        }
                    } catch (Exception ex) {
                        soapResponse.setValue("text", "Error while connecting to server");
                    }
                } else {
                    soapResponse.setValue("text", "Phone source or phone destination not valid");
                    handleError(
                            new RuntimeException("User or pin not valid"),
                            soapResponse,
                            zimbraExceptionContainer
                    );
                }
                break;
            }

            case ("send_call"):
            {
                String caller = zimbraContext.getParameter("caller", "");
                String callee = zimbraContext.getParameter("callee", "");
                if( caller.length() > 0 && callee.length() > 0 ) {
                    OriginateAction action = new OriginateAction();
                    action.setChannel(zimbraContext.getParameter("dialChannelType", "")+"/"+caller);
                    action.setContext(zimbraContext.getParameter("dialContext", ""));
                    action.setExten(callee);
                    action.setCallerId(callee + " <" + caller + ">");
                    action.setPriority(1);
                    action.setTimeout(timeout);
                    ManagerResponse response;
                    try {
                        if (managerConnection==null) {
                            soapResponse.setValue("text","ManagerConnection is null");
                        } else {
                            managerConnection.login("off");
                            response = managerConnection.sendAction(action,timeout+10);
                            soapResponse.setValue("text",response.getMessage());
                            soapResponse.setValue("success",true);
                            managerConnection.logoff();
                        }
                    }
                    catch (Exception e) {
                        soapResponse.setValue("text","Error while connecting to server");
                    }
                }
                else {
                    soapResponse.setValue("text","Phone number empty!");
                }
                break;
            }
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