#Universal Dialer

Due to the great variety of PBX systems, each with its own API, it's not possible to create a zimlet with standardized setup instructions.

The purpose of this zimlet is to support as many PBX systems as possible allowing to originate a call through a SIP phone in the easiest way.

## Supported PBX systems

* SipX/SipXecs
* Asterisk
* MetaSwitch
* 3cx (only for 12 and 12.5, not tested)
* ...more are coming ([Developers Guide](Devel.md))

## Installation

Zimlet installation require **_deployment_** and[**_configuration._**](#configuration-section)

The **_deployment_** step can be achieved through [package deployment](#manual-deploy);
furthermore it's shown how to do the [manual deployment.](#manual-deploy)

### <a name="package-deploy"></a>Package Deployment (Deprecated, see manual installation)

**Due to some issues about zimbra upgrade, zal package is not more available. This chapter is left here for reference purpouse.**

Package deployment use deb package or rpm package.

The Universal Dialer depends on openzal library, the packages are available in the links below.

Download the proper packages:

* [openzal-1.10.deb](https://github.com/ZeXtras/OpenZAL/releases/download/1.10.5/openzal-1.10.deb) and universal-dialer.deb
* [openzal-1.10.rpm](https://github.com/ZeXtras/OpenZAL/releases/download/1.10.5/openzal-1.10-5-0.noarch.rpm) and universal-dialer.rpm

Then run the related command in the right directory with both deb packages:

```
# dpkg -i openzal-1.10.deb universal-dialer.deb
```
or

```
# rpm -i openzal-1.10.rpm universal-dialer.rpm
```

### <a name="configuration-section"></a>Configuration

To configure org_zetalliance_universaldialer a change to the config_template.xml file is required:

* Login as the **zimbra** user
* Extract config_template.xml file from the zimlet package running the following command:

    ```
    zimbra@host$ zmzimletctl getConfigTemplate /opt/zimbra/zimlets/org_zetalliance_universaldialer.zip > /tmp/config_template.xml.tmp
    ```
* Edit the /tmp/config_template.xml.tmp file according to your needs (Be sure to change server property with exactly supported string)
* Import the new configuration file by the running following command:

    ```
    zimbra@host$ zmzimletctl configure /tmp/config_template.xml.tmp
    ```

## Usage

The usage of the zimlet is divided in two parts: the Settings step that must be done once at the beginning and the Call action

If the phone settings have not been entered, opening the "Call" Dialog will redirect to the "Settings" Dialog.

### Settings

Every user have to enable his local phone with number/pin combination and possible custom properties.
The following actions will open the Settings Dialog:
1. Right click on the Universal Dialer item in the zimlet menu on the left column, then click on Settings entry
2. Double click on the Universal Dialer item in the zimlet menu on the left column

The Settings step ends only when the number/pin combination is authenticated.

### Call

There are 2 ways to perform a make call action:
* Right Click on a phone number and click "call", that will skip Call Dialog and start the call right away
* Open the Call Dialog and enter the number you wish to call

The following actions will open the Call Dialog:
1. Right click on the Universal Dialer item in the zimlet menu on the left column, then click on Call entry
2. Single click on the Universal Dialer item in the zimlet menu on the left column

## <a name="manual-deploy"></a>Manual Installation

This section shows the with a manual installation procedure; after that,[configuration](#configuration-section)must be performed.

Download the following files:

* org_universal_dialer.zip
* universal-dialer-extension.jar
* asterisk-java-1.0.0-m1.jar (located in extension/lib)


#### Zimlet Deploy

There are two methods to deploy any zimlet in zimbra:
via admin interface (GUI) and via command-line interface (CLI).

GUI Deployment (Zimbra 8.x):

* Access your Zimbra Administration Console
* Enter the "Configure" section
* Select the "Zimlet" entry
* Click on the gear icon on the top-right corner of the panel and select "Deploy"
* Click on the "Choose File" button and browse for org_zetalliance_universaldialer.zip
* Enable the zimlet on the appropriate Class of Service

CLI Deployment:
* Log into the server as the **zimbra** user
* Place org_zetalliance_universaldialer.zip in /opt/zimbra/zimlets directory of your server
* Run following command:

    ```
    zimbra@host$ zmzimletctl deploy /opt/zimbra/zimlets/org_zetalliance_universaldialer.zip
    ```
The standard installation process enables the zimlet on the default class of service.
To enable it on other classes of service, follow the standard zimlet enable/disable process.

#### Extension Deploy

Second step require to enable Extension (necessary for Asterisk):

 * Login as the **root** user
 * Create extension directory:
 
    ```
    # mkdir /opt/zimbra/lib/ext/universalDialer
    ```
 * Download the correct openzal version for your zimbra version:
 
    ```
    # wget "https://openzal.org/1.11/zal-1.11-${ZIMBRA_VERSION}.jar" -O "/tmp/zal.jar"
    ```
 * Copy the extension package, the openzal package and the necessary library packages (e.g.: asterisk-java-1.0.0-m1.jar):
 
    ```
    # cp {path-to}/universal-dialer-extension.jar /opt/zimbra/lib/ext/universalDialer/
    ```
    
    ```
    # cp /tmp/zal.jar /opt/zimbra/lib/ext/universalDialer/
    ```
    
    ```
    # cp {path-to}/asterisk-java-1.0.0-m1.jar /opt/zimbra/lib/ext/universalDialer/
    ```
 * Login as the **zimbra** user and restart zimbra with
 
    ```
    zimbra@host$ zmcontrol restart
    ```

##TODO

* Universal Dialer collides with default zimlet _com_zimbra_phone_ and number's inspection may fail;
in order to prioritize Universal Dialer as **zimbra** user run following command:

    ```
    zmzimletctl setPriority org_zetalliance_universaldialer 0
    ```