ZIMLET=org_zetalliance_universaldialer
PACKAGE=$(ZIMLET).zip

all: package install

package: clean
	zip $(PACKAGE) \
		org_zetalliance_universaldialer.xml \
		config_template.xml \
		UniversalDialer.css \
		UniversalDialer.js \
		base64.js \
		*.properties \
		UniversalDialer.jsp \
		UniversalDialerConnection.js \
		UniversalDialerDialogs.js \
		UniversalDialerSettings.js \
		UniversalDialerViews.js \
		icon-universal-dialer.png \
		icon-universal-dialer-call.png \
		icon-universal-dialer-settings.png \
		asterisk-java-1.0.0-m1.jar

install:
	cp $(PACKAGE) /tmp/$(PACKAGE)
#	chown zimbra:zimbra /tmp/$(PACKAGE)
	sudo su -c "/opt/zimbra/bin/zmzimletctl undeploy $(ZIMLET)" zimbra
	sudo su -c "/opt/zimbra/bin/zmzimletctl deploy /tmp/$(PACKAGE)" zimbra

clean:
	rm -rf $(PACKAGE)

.PHONY: $(PACKAGE)
