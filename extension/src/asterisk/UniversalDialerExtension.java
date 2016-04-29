package asterisk;

import org.openzal.zal.extension.ZalExtension;
import org.openzal.zal.extension.ZalExtensionController;
import org.openzal.zal.extension.Zimbra;
import org.openzal.zal.log.ZimbraLog;
import org.openzal.zal.soap.SoapServiceManager;

import java.lang.ref.WeakReference;

/**
 * ZAL Extension created to operate on a DAV server using the SOAP interface.
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
        return "asteriskExtension";
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
        ZimbraLog.mailbox.info("Loaded Asterisk extension.");
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
