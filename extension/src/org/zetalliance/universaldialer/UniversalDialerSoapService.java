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

import org.openzal.zal.Provisioning;
import org.openzal.zal.soap.QName;
import org.openzal.zal.soap.SoapHandler;
import org.openzal.zal.soap.SoapService;

import java.util.HashMap;
import java.util.Map;

public class UniversalDialerSoapService implements SoapService
{
    private final HashMap<QName, SoapHandler> mServiceMap;

    public UniversalDialerSoapService(final Provisioning provisioning)
    {
        mServiceMap = new HashMap<QName, SoapHandler>()
        {{
            put(AsteriskSoapHandler.REQUEST_QNAME, new AsteriskSoapHandler(provisioning));
            //put(NewPBXSoapHandler.REQUEST_QNAME, new NewPBXSoapHandler(provisioning));
            /**
             *  AddPbx: add here the Soap handler that handle the request,
             *      a new SoapHandler file must be implemented
             *      where the connection to the PBX is managed by 'handleRequest' function
             */
        }};
    }

    @Override
    public Map<QName, ? extends SoapHandler> getServices()
    {
        return mServiceMap;
    }

    @Override
    public String getServiceName()
    {
        return "SoapServlet";
    }

    @Override
    public boolean isAdminService()
    {
        return false;
    }
}