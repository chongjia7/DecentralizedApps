var postURL = 'http://192.168.1.79:5000'; 

function scanBarcode()
{
	cordova.plugins.barcodeScanner.scan(function(result)
	{
		if (result.cancelled == false)
		{
			sessionStorage.setItem('qrcode',result.text); 
			var stationID = result.txt; 
			$.ajax({
				url: postURL + '/api/station/' + stationID, 
				method: 'GET', 
				crossDomain: true, 
				dataType:"json", 
				contentType: "application/json; charset = utf-8", 
				success: function(data){
					sessionStorage.setItem("stationdata", JSON.stringify(data)); 
					var stationdata = JSON.parse(sessionStorage.getItem('stationdata'));
					sessionStorage.setItem('rate',stationdata[0]);
					sessionStorage.setItem('location', stationdata[1]); 

					console.log(data);
					location.href = 'contract.html'; 
				},
				error: function(){console.log("Error");}
			});
		}
	},
	, 
	function(error)
	{
		$('#blemessage').html('QR code scanning failed: ' + error);
	}, 
	{
		"preferFrontCamera:false,"
		"showFlipCameraButton": true, 
		"prompt": "Place a QR inside the scan area", 
		"formats": "QR_code", 
		"orientation":"potrait"
	}
	);
}

function transactionConfirm() {location.href = 'confirm.html';}

function transactPage() 
{
	var minutes = parseFloat($('#minutes').val()); 
	var rate = sessionStorage.getItem('rate'); 
	var amount = minutes * rate; 
	sessionStorage.setItem('amount', amount); 
	sessionStorage.setItem('minute', minutes); 
	location.href ='transact.html';

}

function onDeviceReady()
{
	window.StatusBar.backgroundColorByHexString("#ff5722");
}

function transactionConfirm()
{
	var email = sessionStorage.getItem('useremail'); 
	var ID = parseFloat(sessionStorage.getItem('qrcode')); 
	var duration = parseFloat(sessionStorage.getItem('minutes')) * 60; 
	var datadir = 
	{
		email: email, 
		ID: ID, 
		duration: duration
	}; 
	console.log(datadir);
	$.ajax({
		url: postURL + '/api/activateStation', 
		method: 'POST', 
		crossDomain: true, 
		dataType: 'json',
		contentType: "application/json; CHARSET = utf-8", 
		success: function(data)
		{
			sessionStorage.setItem('txdict', JSON.stringify(datadir)); 
			sessionStorage.setItem('txdata', JSON.stringify(data)); 
			location.href = 'confirm.html';
		}, 
		error: function()
		{
			console.log("Failed");
		}, 
		data: JSON.stringify(datadir)
	}); 
}

function isAvailable()
{
	window.plugins.googleplus.isAvailable(function(avail){alert(avail)});
}

function login()
{
	$('#loginmessage').html("Logging in ..."); 
	window.plugins.googleplus.login({},
		function(obj){
			$('#loginmessage').html(obj.email + ' - ' + obj.displayName); 
			sessionStorage.setItem('userimg', obj.imageUrl); 
			sessionStorage.setItem('username', obj.displayName); 
			sessionStorage.setItem('useremail', obj.email); 
			var emailid = obj.email; 
			$.ajax({
				url: postURL + '/api/user/' + emailid, 
				method:'GET',
				crossDomain: true, 
				dataType: 'json', 
				contentType: "application/json; charset = utf-8", 
				sucess: function(data){
					sessionStorage.setItem('userdata', JSON.stringify(data)); 
					//console.log(data);
					$('#loginmessage').html("Success"); 
					location href = "home.html";
				}, 
				error: function (msg) { $('#loginmessage').html(msg);}
			}); 
		},) 
}

function trySilentLogin(){
		window.plugins.googleplus.trySilentLogin({}, function(obj) {console.log(obj.email);}, function(msg) {console.log(msg);});}


function logout() 
{
	window.plugins.googleplus.logout(function(msg){console.log(msg);}, function(msg) {console.log(msg);});
} 

$(document).ready(function()
{
	document.addEventListener('deviceready', onDeviceReady, false); 

	$("#btnbarcode").on('click', function(e) 
	{
		e.preventDefault(); 
		scanBarcode(); 
	}); 

	$("#btnpay").on('click', function(e){
		e.preventDefault(); 
		transactionConfirm(); 
	}); 

	$('#loginwithgoogle').on('click', function(e){
		e.preventDefault(); 
		login();
	}); 

	$('#logout').on('click', function(e){
		e.preventDefault(); 
		logout();
	}); 
});

$(document).on('pagebeforecreate','[data-role = 'page']', function() { setTimeout(function() {$.mobile.loading('show');}, 1);}); 

$(document).on('pageshow','[data-role = 'page']', function() { setTimeout(function() {$.mobile.loading('hide');}, 1);}); 
























