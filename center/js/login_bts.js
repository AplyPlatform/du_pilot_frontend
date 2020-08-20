var langset = "KR";

function goHome() {            
  if (langset == "KR" || langset == "")
    location.href="index.html?fromapp=" + getCookie("isFromApp");
  else
  	location.href="index_en.html?fromapp=" + getCookie("isFromApp");
}

function facebookInit() {
    if ((typeof FB) === "undefined" || FB == null || FB == "") {
      goHome();
      return;
    }

    FB.getLoginStatus(function(response) {
      var skind = getCookie("dev_kind");
      if (skind != "facebook") return;
      if (response.status == "connected") {
        var token = response.authResponse.accessToken;
        if (token != null && token != "")
          formSubmit(token);
        else {
        	alert(LANG_JSON_DATA[langset]['msg_error_sorry']);
        	goHome();
        }
      }
      else {
      }
    });
}

function googleinit() {
  if ((typeof gapi) === "undefined" || gapi == null || gapi == "") {
    goHome();
    return;
  }

  gapi.load('auth2', function() { // Ready.
    gapi.auth2.init();    
  });
}

function googleSignInCallback(googleUser) {		
  var skind = getCookie("dev_kind");
  if (skind != "google") return;

  var token = googleUser.getAuthResponse().id_token;
  formSubmit(token);
}


function naverinit() {
  var naverLogin = new naver.LoginWithNaverId(
      {
        clientId: "wSvRwDA6qt1OWrvVY542",
        callbackUrl: "https://pilot.duni.io/center/navercallback.html",
        isPopup: false,
        loginButton: {color: "green", type: 3, height: 35}
      }
    );
  /* (3) 네아로 로그인 정보를 초기화하기 위하여 init을 호출 */

  if (naverLogin == null) {
    goHome();
    return;
  }

  naverLogin.init();
}


function naverSignInCallback(token) {
  var skind = getCookie("dev_kind");
  if (skind != "naver") return;
  formSubmit(token);
}

function showLoader() {
  $("#loading").show();
}

function hideLoader() {
  $("#loading").fadeOut(800);
}


function delCoockie(cName) {
	document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/";
}

function setCookie(cName, cValue, cDay){
    var date = new Date();
    date.setTime(date.getTime() + cDay * 60 * 60 * 24 * 1000);
    document.cookie = cName + '=' + cValue + ';expires=' + date.toUTCString() + ';path=/';
}

function getCookie(cName) {
    var value = document.cookie.match('(^|;) ?' + cName + '=([^;]*)(;|$)');
    return value? value[2] : null;
}


function ajaxRequest(data, callback, errorcallback) {
    $.ajax({url : "https://api.droneplay.io/v1/",
           dataType : "json",
           crossDomain: true,
           cache : false,
           data : JSON.stringify(data),
           type : "POST",
           contentType: "application/json; charset=utf-8",           
           success : function(r) {
             console.log(JSON.stringify(r));
             callback(r);
           },
           error:function(request,status,error){
               console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
               errorcallback(request,status,error);
           }
    });
}

function isSet(value) {
  if (value == "" || value == null || value == "undefined") return false;

  return true;
}

function formSubmit(token) {
	showLoader();
	
  var skind = getCookie("dev_kind");
  var jdata = {
    action: "member",
    daction: "login",
    sns_token : token,
    sns_kind : skind
  };

  ajaxRequest(jdata, function (r) {
    if(r.result == "success") {
      setCookie("dev_user_id", r.emailid, 1);
      setCookie("user_token", r.token, 1);
      setCookie("user_email", r.socialid, 1);

      if (getCookie("isFromApp") == "yes") {
        Android.setToken(r.token, r.emailid);
        return;
      }

      location.href="center.html";     
    }else {
    	
      hideLoader();
      alert(LANG_JSON_DATA[langset]['msg_you_are_not_member']);
      setCookie("temp_sns_token", r.sns_token, 1);      
            
      location.href="register.html";      
    }
  }, function(request, status, error) {
    hideLoader();
    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
  });

}


function checkLoginStatus() {
	
  $("#fbLoginButton").hide();
  $("#naverIdLogin").hide();
  $("#googleLoginButton").hide(); 	

  var dev_user_id = getCookie("dev_user_id");
  var usertoken = getCookie("user_token");
  if (isSet(dev_user_id) && isSet(usertoken)) {
    location.href="center.html";
    return;
  }

  var dev_kind = getCookie("dev_kind");
  if (isSet(dev_kind) == false) {
    setCookie("dev_user_id", '', -1);
    setCookie("user_token", '', -1);
    goHome();
    return;
  }

  if (dev_kind == "facebook") {
  	hideLoader();
    $("#fbLoginButton").show();
    facebookInit();
  }
  else if (dev_kind == "google") {
  	hideLoader();
    $("#googleLoginButton").show();
    googleinit();
  }
  else if (dev_kind == "naver") {  	
  	hideLoader();
    $("#naverIdLogin").show();
    naverinit();
  }
}



function checkLang() {
	langset = getCookie("language");
	
	if (isSet(langset)) {
		
	}
	else {
		setLang("KR");
	}
}

function setLang(lang) {
	setCookie("language", lang, 1);
	langset = lang;
}

$(function() {	
	checkLang();
	checkLoginStatus();
});