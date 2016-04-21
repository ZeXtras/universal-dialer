ZIMLET=org_zetalliance_universaldialer
PACKAGE=$(ZIMLET).zip

all: package

package: clean
	zip $(PACKAGE) \
		org_zetalliance_universaldialer.xml \
		config_template.xml \
		css/UniversalDialer.css \
		src/UniversalDialer.js \
		base64.js \
		*.properties \
		UniversalDialer.jsp \
		src/UniversalDialerProperty.js \
		src/UniversalDialerPbxManager.js \
		src/pbx/UniversalDialer3cx.js \
		src/pbx/UniversalDialerAsterisk.js \
		src/pbx/UniversalDialerMetaSwitch.js \
		src/pbx/UniversalDialerPbxBase.js \
		src/pbx/UniversalDialerSipX.js \
		src/dialogs/UniversalDialerCallDialog.js \
		src/dialogs/UniversalDialerSettingsDialog.js \
		src/dialogs/view/UniversalDialerCallView.js \
		src/dialogs/view/UniversalDialerSettingsView.js \
		src/dialogs/view/UniversalDialerUserView.js \
		src/lib/UniversalDialerStringUtils.js \
		assets/icon-universal-dialer.png \
		assets/icon-universal-dialer-call.png \
		assets/icon-universal-dialer-settings.png \
		asterisk-java-1.0.0-m1.jar

install:
	cp $(PACKAGE) /tmp/$(PACKAGE)
#	chown zimbra:zimbra /tmp/$(PACKAGE)
	sudo su -c "/opt/zimbra/bin/zmzimletctl undeploy $(ZIMLET)" zimbra
	sudo su -c "/opt/zimbra/bin/zmzimletctl deploy /tmp/$(PACKAGE)" zimbra

clean:
	rm -rf $(PACKAGE)

.PHONY: $(PACKAGE)
