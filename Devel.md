# Universal Dialer Developer Guide

This guide target is to help anyone who wants to extends the zimlet
with extra Pbx handlers or simply improving main code;
the steps that have to be followed to extend the zimlet are shown in the [first chapter](#first).

In the [second chapter](#second) is shown the zimlet architecture.

In the [third chapter](#third) is explained how the zimlet was created.



## <a name="first"></a>1. Integrate extra Pbx

This zimlet has been thought to have the quality to be easily manipulated by developers,
without any concern about Zimbra communication and graphical interface;
the whole process is reduced to create a file (example name UniversalDialerExtraPbx.js)
that implements the UniversalDialerPbxBase.js interface
and few easy steps to integrate it.

The required elements to know before extending the zimlet are the APIs to perform the validation request and the make call request.

When these APIs are clear, the developer have to identify the configuration with the global attributes and the user properties.

### Configuration

Global attributes: values that are common to all user (e.g: name of pbx).
The global attributes have to be declared in the _config_template.xml_ file
and they are recovered in UniversalDialerExtraPbx.js with the javascript command
>this.zimlet.getConfig(attributeName)

User properties: values customizable by each user (e.g: user phone number and user phone pin).
The user properties have to be declared in the _org_zetalliance_universaldialer.xml_ file
and defined in the getUserProperties method of UniversalDialerExtraPbx.js.
They are recovered in UniversalDialerExtraPbx.js with the javascript command
>this.zimlet.getUserProperty(propertyName)

### Extra Pbx handler implementation

UniversalDialerExtraPbx.js has to be an implementation of UniversalDialerPbxBase.js,
so the follow methods must be implemented:

* getName: return the name of pbx, according to global attribute
* sendCall: execute the API to make a call
* validate: execute the API to validate a phone number
* getUserProperties: return the definition of the user properties used in previous API

At last the new pbx handler must be registered in UniversalDialer.js and added to org_zetalliance_universaldialer.xml file with the tag <include>

### Extension

If APIs depend on an external library, the sendCall and validate functions must communicate with the Universal Dialer Extension:
this step requires to implement a new SoapHandler in extension module and add it in UniversalDialerSoapService.
This SoapHandler include the APIs to execute custom commands, so the UniversalDialerExtraPbx.js sendCall and validate functions are reduced to send a SoapRequest with proper parameters.

### Build

A makefile is included in the project.
Examples:
```
make
```

build org_zetalliance_universal.zip and universal-dialer-extension.jar, can be found in dist directory.
```
make package-deb
```
build and create deb package
```
make devel
```
build and install zimlet through deb package.

Any library added to the extension must be manually included in the makefile.

## <a name="second"></a>2. Zimlet architecture

The Universal Dialer has been partitioned in few conceptual modules: core, pbx-handlers, user-interface and extension.

### Core module

* UniversalDialer.js: this class organize the zimlet loading the pbxManager, registering each pbx handler and managing the dialogs popup
* config_template.xml: this template contains the global zimlet configuration
* UniversalDialerStringUtils.js: utility to recover every label in proper language

### Pbx module

* *UniversalDialerPbxManager.js*: redirect all the request to correct pbx handler set in global properties (config_template.xml)
* *UniversalDialerProperty.js*: this class is the standard object of each user property
* *UniversalDialerPbxBase.js*: this is the abstract class that each pbx handler must implements
* (each) *UniversalDialerPbxImplementation*: each class define custom properties and proper API to authenticate and send call

### User Interface module

* UniversalDialerSettingsDialog.js: this dialog send the authentication request to the pbx manager and,
in case of success, store the user credential
* UniversalDialerCallDialog.js: this dialog send the call request to the pbx manager
* UniversalDialerUserView.js: this view appears in both dialogs, shows stored user credential
* UniversalDialerSettingsView.js: this view shows the containers where the user insert his own credential
* UniversalDialerCallView.js: this view shows the input field of the destination phone number

### Extension Module

* UniversalDialerExtension.js: this class extends Zal Extension and register the Soap service
* UniversalDialerSoapService.js: this class manages the Soap Handler
* {pbx}SoapHandler.js: this class handle the soap request exploiting the libraries
* {pbx-library}.jar: these libraries contains java API

## <a name="third"></a>3. Zimlet creation

The main files that is required to create a zimlet are the
[zimlet.xml](org_zetalliance_universaldialer.xml)
and the [handler function](src/UniversalDialer.js).

#### zimlet.xml
The zimlet.xml is the zimlet definition file and must be renamed as the zimlet name, in our case org_universaldialer.xml.
This file contains the descriptive attributes:

1. name: zimlet name used almost everywhere

2. version: current version of the zimlet

3. label: label that substitute the name

4. description: a short description of the zimlet

Moreover, the zimlet definition file must contains the following elements:

 *\<include>*: contains the definition of the javascript files that the web client has to load

 *\<includeCSS>*: contains the definition of the Css files

 *\<handlerObject>*: contains the JavaScript object constructor that initialize the zimlet

 *\<zimletPanelItem>*: contains the definition of the action menu that popup when a right click is performed on zimlet item in the zimlet menu on the left column

 *\<contentObject>*: contains the object's definition that is recognized by a zimlet in a body of content

 *\<userProperties>*: contains the definition of the properties that allows the zimlet to store the private configuration of each user

#### handler function

The function that is initialized by the zimlet has two main rules.
First of all it must be defined in an included javascript file of zimlet.xml;
the second rule requires that the function has the same name of the handlerObject element of zimlet.xml.

Moreover this function has some methods that are executed when the user perform particular actions:

* init(): executed on page load

* singleClicked(): executed on single click over the zimlet item in the zimlet menu on the left column

* doubleClicked(): executed on double click over the zimlet item in the zimlet menu on the left column

* toolTipPoppedUp(spanElement, contextObjText): executed when the tool tip is popped-up, in accordance to contentObject of zimlet.xml

* menuItemSelected(menuItemId): executed on zimlet item selected, menuItemId is the `id` field declared in zimletPanelItem of zimlet.xml
