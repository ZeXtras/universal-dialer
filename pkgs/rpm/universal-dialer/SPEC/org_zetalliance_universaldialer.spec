Name: universal-dialer
Version: 1.0
BuildArch: noarch
License: GPLv2
Summary: Universal Dialer Zimlet for Zimbra.
Release: 0
Requires: openzal-1.10

%define _rpmdir universal-dialer/RPMS

%description
    Universal Dialer Zimlet for Zimbra.

%files
    /opt/zimbra/zimlets/org_zetalliance_universaldialer.zip
    /opt/zimbra/lib/ext/universalDialer/universal-dialer-extension.jar
    /opt/zimbra/lib/ext/universalDialer/asterisk-java-1.0.0-m1.jar

%post
    chown zimbra:zimbra /opt/zimbra/zimlets/org_zetalliance_universaldialer.zip
    su -c "/opt/zimbra/bin/zmzimletctl deploy /opt/zimbra/zimlets/org_zetalliance_universaldialer.zip" zimbra

    ZIMBRA_VERSION=$(sudo su - zimbra -c "zmcontrol -v" | tr -d '\n' | sed -r 's/.* ([0-9\.]+[0-9]).*/\1/')

    ln -f -s /usr/share/openzal/1.10/${ZIMBRA_VERSION}/zal.jar /opt/zimbra/lib/ext/universalDialer/zal.jar

    echo ""
    echo "Installation successful."
    echo "Universal Dialer works only after a zimbra restart:"
    echo "sudo su -c '/opt/zimbra/bin/zmmailboxdctl restart' zimbra"


%preun
    rm /opt/zimbra/lib/ext/universalDialer/zal.jar
    su -c "/opt/zimbra/bin/zmzimletctl undeploy org_zetalliance_universaldialer" zimbra