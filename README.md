#Universal Dialer

Due to great variety of PBX systems with own API, is not possible to create a zimlet with standard instructions.

The purpose of this zimlet is to collect most type of PBX System and follow the simplest way to originate a call in a SIP phone.

##Supported PBX systems

* SipX/SipXecs
* Asterisk
* MetaSwitch (not tested)
* 3cx (only for 12 and 12.5, not tested)
* ...more are coming

##Installation

Zimlet installation require **_deployment,_** **_configuration_** and **_extension._**

### Deployment

Deployment 8.x GUI:

* Enter your Zimbra Administration Console
* Select "Configure" section
* Select "Zimlet" entry
* Click on the "gear" button on the top-right corner of the panel and select "Deploy"
* Click on Choose File button and find org_zetalliance_universaldialer.zip
* Enable in your choice Class of Service



CLI Deployment:
* Log as **zimbra** user
* Place org_zetalliance_universaldialer.zip in /opt/zimbra/zimlets directory of your server
* Run following command: **`zmzimletctl deploy org_zetalliance_universaldialer.zip`**

### Configuration

To configure org_zetalliance_universaldialer is necessary change config_template.xml file:

* Log as **zimbra** user
* Extract config_template.xml running following command:

**`zmzimletctl getConfigTemplate org_zetalliance_universaldialer.zip > /tmp/config_template.xml.tmp`**

* Edit /tmp/config_template.xml.tmp with necessary parameters (Be sure to change *server* property with exactly supported string)
* Export configuration running following command:

**`zmzimletctl configure /tmp/config_template.xml.tmp`**

### Extension

Last step require to enable Extension (necessary for Asterisk):

 * Log as **root** user
 * Create extension directory:

 **`mkdir /opt/zimbra/lib/ext/universalDialer`**

 * Download correct openzal version for your zimbra version:

 **`wget "https://openzal.org/1.10/zal-1.10.5-${ZIMBRA_VERSION}.jar" -O "/tmp/zal.jar"`**

 * Copy extension jar, openzal jar and necessary library jar (at the moment only asterisk java jar):

 **`cp {path-to}/universal-dialer-extension.jar /opt/zimbra/lib/ext/universalDialer/`**

 **`cp /tmp/zal.jar /opt/zimbra/lib/ext/universalDialer/`**

 **`cp {path-to}/ /opt/zimbra/lib/ext/universalDialer/`**

 * Restart zimbra with **`zmcontrol restart`**

##Usage

If Settings step is skipped, every try to open Call Dialog will be redirected to Settings Dialog.

Standard installation enable this zimlet in _default_ class of service. Any local configuration follow standard procedure.

###Settings

Every user have to enable his local phone with number/pin combination:
right click on zimlet menu panel and open Settings Dialog, then insert user number and user pin.


###Call

There are 2 ways to perform a make call action:
* Click on Call entry, that open the Call Dialog in menu and input the destination number
* Right Click on a matching number and perform call, that skip Call Dialog and straight send the request

##TODO

* Universal Dialer collides with default zimlet _com_zimbra_phone_ and number's inspection may fail;
in order to prioritize Universal Dialer as **zimbra** user run following command:
**`zmzimletctl setPriority org_zetalliance_universaldialer 0`**
* Improve Asterisk to remove his special cases
* Tests