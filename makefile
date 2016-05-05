ZIMLET=org_zetalliance_universaldialer
PACKAGE=$(ZIMLET).zip
CURRENT_PATH=$(shell pwd)

all: compile

compile: clean
	mkdir -p dist
	zip dist/$(PACKAGE) \
		org_zetalliance_universaldialer.xml \
		config_template.xml \
		css/UniversalDialer.css \
		src/UniversalDialer.js \
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
		src/lib/base64.js \
		assets/icon-universal-dialer.png \
		assets/icon-universal-dialer-call.png \
		assets/icon-universal-dialer-settings.png
	cd extension; ant
	mv extension/universal-dialer-extension.jar dist

package-deb: compile
	mkdir -p pkgs/deb/universal-dialer/opt/zimbra/zimlets
	mkdir -p pkgs/deb/universal-dialer/opt/zimbra/lib/ext/universalDialer
	cp dist/$(PACKAGE) pkgs/deb/universal-dialer/opt/zimbra/zimlets
	cp dist/universal-dialer-extension.jar pkgs/deb/universal-dialer/opt/zimbra/lib/ext/universalDialer
	cp extension/lib/asterisk-java-1.0.0-m1.jar pkgs/deb/universal-dialer/opt/zimbra/lib/ext/universalDialer

	cd pkgs/deb; dpkg-deb --build universal-dialer
	mv pkgs/deb/universal-dialer.deb dist/universal-dialer.deb

package-rpm: compile
	mkdir -p pkgs/rpm/universal-dialer/RPMS
	mkdir -p pkgs/rpm/universal-dialer/buildroot/opt/zimbra/zimlets
	mkdir -p pkgs/rpm/universal-dialer/buildroot/opt/zimbra/lib/ext/universalDialer
	cp dist/$(PACKAGE) pkgs/rpm/universal-dialer/buildroot/opt/zimbra/zimlets
	cp dist/universal-dialer-extension.jar pkgs/rpm/universal-dialer/buildroot/opt/zimbra/lib/ext/universalDialer
	cp extension/lib/asterisk-java-1.0.0-m1.jar pkgs/rpm/universal-dialer/buildroot/opt/zimbra/lib/ext/universalDialer

	cd pkgs/rpm; rpmbuild -bb --buildroot $(CURRENT_PATH)/pkgs/rpm/universal-dialer/buildroot universal-dialer/SPEC/org_zetalliance_universaldialer.spec
	mv pkgs/rpm/universal-dialer/RPMS/noarch/universal-dialer* dist/universal-dialer.rpm

package: package-deb package-rpm

devel: compile package-deb
	sudo dpkg -i dist/universal-dialer.deb

clean:
	rm -rf dist
	rm -rf extension/build


.PHONY: $(PACKAGE)
