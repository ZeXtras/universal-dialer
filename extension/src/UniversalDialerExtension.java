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

import org.openzal.zal.extension.ZalExtension;
import org.openzal.zal.extension.ZalExtensionController;
import org.openzal.zal.extension.Zimbra;
import org.openzal.zal.log.ZimbraLog;
import org.openzal.zal.soap.SoapServiceManager;

import java.lang.ref.WeakReference;

/**
 * ZAL Extension created to operate using the SOAP interface.
 * The core of the ZAL will take care to handle this extension.
 */
public class UniversalDialerExtension implements ZalExtension {
    private final SoapServiceManager mSoapServiceManager;
    private final Zimbra mZimbra;
    private UniversalDialerSoapService mSoapService;

    public UniversalDialerExtension() {
        mZimbra = new Zimbra();
        mSoapServiceManager = new SoapServiceManager();
        mSoapService = new UniversalDialerSoapService(mZimbra.getProvisioning());
    }

    @Override
    public String getBuildId() {
        return "1";
    }

    @Override
    public String getName() {
        return "universalDialerExtension";
    }

    /**
     * Method called by the ZAL Core to do the startup if the extension.
     *
     * @param zalExtensionController The ZAL Controller instance.
     * @param weakReference          The Zimbra class loader reference.
     */
    @Override
    public void startup(ZalExtensionController zalExtensionController, WeakReference<ClassLoader> weakReference) {
        mSoapServiceManager.register(mSoapService);
        ZimbraLog.mailbox.info("Loaded Universal Dialer extension.");
    }

    /**
     * Method called by the ZAL Core to do the shutdown if the extension.
     */
    @Override
    public void shutdown() {
        mSoapServiceManager.unregister(mSoapService);
        ZimbraLog.mailbox.info("Removed Asterisk extension.");
    }
}
