#Universal Dialer

Due to the great variety of PBX systems, each with its own API, it's not possible to create a zimlet with standardized setup instructions.

The purpose of this zimlet is to collect most type of PBX systems and allow to originate a call through a SIP phone in the easiest way.


##Supported PBX systems

* SipX/SipXecs (working)
* Asterisk (working, to be improved)
* 3cx (not tested)
* MetaSwitch (not tested)
* ...more are coming


##Installation

This zimlet's' installation requires both **_deployment_** and **_configuration_**.


### Deployment

GUI Deployment (Zimbra 8.x):

* Access your Zimbra Administration Console
* Enter the "Configure" section
* Select the "Zimlet" entry
* Click on the gear icon on the top-right corner of the panel and select "Deploy"
* Click on the "Choose File" button and browse for org_zetalliance_universaldialer.zip
* Enable the zimlet on the appropriate Classes of Service

CLI Deployment:
* Log into the server as the **zimbra** user
* Place org_zetalliance_universaldialer.zip in /opt/zimbra/zimlets directory of your server
* Run the following command: **`zmzimletctl deploy org_zetalliance_universaldialer.zip`**

### Configuration

To configure org_zetalliance_universaldialer a change to the config_template.xml file is required:

* Login as the **zimbra** user
* Extract the config_template.xml file from the zimlet package running the following command:

**`zmzimletctl getConfigTemplate org_zetalliance_universaldialer.zip > /tmp/config_template.xml.tmp`**

* Edit the /tmp/config_template.xml.tmp file according to your needs (Be sure to change *server* property with exactly supported string)
* Import the new configuration file by the running following command:

**`zmzimletctl configure /tmp/config_template.xml.tmp`**


### Universal Dialer and Asterisk

On Zimbra 8.5+, to complete the zimlet installation you need to enable .jsp files on your server.

Check whether .jsp files are enabled with the following command:

**`zmprov gs your.server.com | grep zimbraZimletJspEnabled`**

If the command returns FALSE, enable .jsp files by running:

**`zmprov ms your.server.com zimbraZimletJspEnabled TRUE`**

Restart zimbra with **`zmcontrol restart`**

Asterisk also requires to set a context in the user interface and doesn't have an authorization control, which is given by the admin in the global config.


##Usage

If the phone settings have not been entered, opening the "Call" Dialog will redirect to the "Settings" Dialog.

The standard installation process enables the zimlet on the _default_ class of service. To enable it on other classes of service, follow the standard zimlet enable/disabe process.


###Settings

Every user needs to enable his local phone via its number/pin combination: to do so, right click on zimlet menu panel and open Settings Dialog, then insert user number and user pin.


###Call

There are 2 ways to start a call:
* Click on the "Call" entry, which opens the Call Dialog and enter the number you wish to call
* Right Click on a phone number and click "call", that'll' skip Call Dialog and start the call right away


##TODO

* Universal Dialer collides with default zimlet _com_zimbra_phone_ and number recognition might fail: in order to prioritize Universal Dialer over _com_zimbra_phone_ run the following command as the **zimbra** user:
**`zmzimletctl setPriority org_zetalliance_universaldialer 0`**
* Improve Asterisk compatibility to remove its special cases
* Testing