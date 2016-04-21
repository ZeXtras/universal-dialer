<%@ page language="java" import="java.lang.*"%>
<%@ page language="java" import="java.io.*"%>
<%@ page language="java" import="java.util.*"%>
<%@ page language="java" import="javax.servlet.http.*"%>
<%@ page language="java" import="java.net.*"%>
<%@ page language="java" import="org.asteriskjava.*"%>
<%@ page language="java" import="org.asteriskjava.manager.*"%>
<%@ page language="java" import="org.asteriskjava.manager.action.*"%>
<%@ page language="java" import="org.asteriskjava.manager.response.*"%>
<%@ page language="java" import="com.zimbra.common.util.*"%>
<%@ page contentType="text/plain; charset=UTF-8" %>
<%@ page pageEncoding="ISO-8859-1" %>
<%--
  ~ Universal Dialer - An universal click2call zimlet for Zimbra
  ~ Copyright (C) 2016 ZeXtras S.r.l.
  ~
  ~ This file is part of Universal Dialer.
  ~
  ~ This program is free software; you can redistribute it and/or
  ~ modify it under the terms of the GNU General Public License
  ~ as published by the Free Software Foundation, version 2 of
  ~ the License.
  ~
  ~ This program is distributed in the hope that it will be useful,
  ~ but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~ GNU General Public License for more details.
  ~
  ~ You should have received a copy of the GNU General Public License
  ~ along with Universal Dialer. If not, see <http://www.gnu.org/licenses/>.
  --%>

<%!

private String executeRequest(HttpServletRequest request) {
  long timeout = Long.parseLong(request.getParameter("timeout")) * 1000L;
  String caller = request.getParameter("caller");
  String callee = request.getParameter("callee");
  ManagerConnection managerConnection = null;
	int port;

	try {
    port=Integer.parseInt(request.getParameter("managerPort"));
  } catch (NumberFormatException e) {
    port=5038;
  }

	ManagerConnectionFactory mCF= new ManagerConnectionFactory(
    request.getParameter("managerIp"),
    port ,
    request.getParameter("managerUser"),
    request.getParameter("managerSecret")
	);
	managerConnection = mCF.createManagerConnection();
	String responseStr = "";
	if (caller!=null && callee!=null) {
		if( caller.length() > 0 && callee.length() > 0 ) {
      OriginateAction action = new OriginateAction();
      action.setChannel(request.getParameter("dialChannelType")+"/"+caller);
      action.setContext(request.getParameter("dialContext"));
      action.setExten(callee);
      action.setCallerId(callee + " <" + caller + ">");
      action.setPriority(new Integer(1));
      action.setTimeout(new Long(timeout));
      ManagerResponse response;
      try {
        if (managerConnection==null) {
          responseStr="ManagerConnection is null";
        }
        managerConnection.login("off");
        response = managerConnection.sendAction(action,timeout+10);
        responseStr=response.getMessage();
      }
      catch (Exception e) {
        responseStr="Error while connecting to server";
      }
		}
		else { responseStr="Phone number empty!";}
	}
	else {
		responseStr="Phone source or phone destination not valid";
	}
    if (managerConnection != null) {
      if (managerConnection.getState() == ManagerConnectionState.CONNECTED
        || managerConnection.getState() == ManagerConnectionState.RECONNECTING) {
        managerConnection.logoff();
        managerConnection = null;
      }
      managerConnection = null;
	}
	return responseStr;
}
%>
<%
out.println(executeRequest(request));
%>