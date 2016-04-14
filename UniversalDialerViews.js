function UniversalDialerViews() {
}
UniversalDialerViews.prototype.constructor = UniversalDialerViews;

UniversalDialerViews.prototype.createUserView = function (zimlet, userGroup) {
  var view, userPhoneToolbar, userPhoneText, userPhone,  userContextToolbar, userContextText, userContext;
  view = new DwtComposite({parent:userGroup});
    userPhoneToolbar = new DwtToolBar({parent:view});
      userPhoneText = new DwtLabel({parent:userPhoneToolbar});
        userPhoneText.setText(zimlet.getMessage("syncPhone"));
        userPhoneText.setSize(200,24);
      userPhone = new DwtLabel({parent:userPhoneToolbar});
        userPhone.setText(zimlet.getUserProperty("voip_user"));
  if (zimlet.settingsManager.getServerInfo().name == "asterisk") {
    userContextToolbar = new DwtToolBar({parent: view});
      userContextText = new DwtLabel({parent: userContextToolbar});
        userContextText.setText(zimlet.getMessage("syncPhoneContext"));
        userContextText.setSize(200, 24);
      userContext = new DwtLabel({parent: userContextToolbar});
        userContext.setText(zimlet.getUserProperty("dial_context"));
  }
  return view;
};

UniversalDialerViews.prototype.createSetView = function (zimlet, settingsCtrl) {
  var view, setPhoneToolbar, setPhoneLabel, setContToolbar, setContLabel, setPinToolbar, setPinLabel;
  view = new DwtComposite({parent:settingsCtrl});
    setPhoneToolbar = new DwtToolBar({parent:view});
      setPhoneLabel = new DwtLabel({parent:setPhoneToolbar});
        setPhoneLabel.setText(zimlet.getMessage("phoneId"));
        setPhoneLabel.setSize(200,24);
      new DwtInputField({parent:setPhoneToolbar, className: "DwtInputField", inputId:"VoIPPhoneId"});
  if (zimlet.settingsManager.getServerInfo().name == "asterisk") {
    setContToolbar = new DwtToolBar({parent: view});
      setContLabel = new DwtLabel({parent: setContToolbar});
        setContLabel.setText(zimlet.getMessage("context"));
        setContLabel.setSize(200, 24);
      new DwtInputField({parent: setContToolbar, className: "DwtInputField", inputId: "dialContextId"});
  }
  if (zimlet.settingsManager.getServerInfo().name == "sipX" ||
    zimlet.settingsManager.getServerInfo().name == "3cx" ||
    zimlet.settingsManager.getServerInfo().name == "metaSwitch") {
    setPinToolbar = new DwtToolBar({parent: view});
      setPinLabel = new DwtLabel({parent: setPinToolbar});
        setPinLabel.setText(zimlet.getMessage("pin"));
        setPinLabel.setSize(200, 24);
      new DwtInputField({parent: setPinToolbar, className: "DwtInputField", inputId: "VoIPPhonePin"});
  }
};

UniversalDialerViews.prototype.createCallView = function (zimlet, callGroup, callee) {
  var view, callPhoneToolbar, callPhoneLabel;
  view = new DwtComposite({parent:callGroup});
    callPhoneToolbar = new DwtToolBar({parent:view});
      callPhoneLabel = new DwtLabel({parent:callPhoneToolbar});
        callPhoneLabel.setText(zimlet.getMessage("numberToCall"));
        callPhoneLabel.setSize(200,24);
      new DwtInputField({parent:callPhoneToolbar, className: "DwtInputField", inputId:"calleeId", initialValue:callee});
  return view;
};