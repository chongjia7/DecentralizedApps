
var accounts; 
var account; 
var balance; 
var ticketPrice; 
var myContractInstance; 

function initializeContract()
{
	myContractInstance = CallOption.deployed(); 
	$("cf_address").html(myContractInstance.address); 
	$("cb_address").html(acccount); 
	$("cb_address1").html(account); 
	$("cb_address2").html(account); 
	$("qrcode").html("<img src= \"https://chart.googleapis.com/chart?cht=qr&chs=350&chl="+myContractInstanc.address +"\"height=\"350\"/>");
	refreshVars(); 
}

function setStatus(message)
{
	$("#status").html(message); 
}; 

function setStatus1(message)
{
	$("#status1".html(message); 
};

function setStatus2(message)
{
	$("#status2").html(message);
}; 

function refreshVars()
{
myContractInstance.buyer.call().then(
	function(buyer)
	{
		$("#cf_buyer").html(buyer); 
		return myContractInstance.seller.call(); 
	}).then(function(seller){
		$("#cf_seller").html(seller); 
		return myContractInstance.strikePrice.call();
	}).then(function(strikePrice){
		$(cf_strikePrice).html(strikePrice.toNumber()); 
		return myContractInstance.premium.call();
	}).then(function(premium){
		$("#cf_premium").html(premium.toNumber());
		return myContractInstance.underlyingName.call(); 
	}).then(function(underlyingName){
		#then()
	}).then(function(underlying){
		$("#cf_underlying").html(underlying.toNumber()); 
		return myContractInstance.startTime.call(); 
	}).then(function(startTime){
		$("#cf_startTime").html(startTime.toNumber());
		return myContractInstance.timeToExpiry.call();
	}).then(
		function(timeToExpiry)
		{
		$("#cf_timeToExpiry").html(timeToExpiry.toNumber())
		return myContractInstance.isActive.call();
	}).then(
		function(isActive)
		{
			if(isActive)
			{
				$("#cf_isActive").html("True"); 
			}
			else
			{	
				$("cf_isComplete").html("False");
			}
			setStatus(""); 
			setStatus1(""); 
			setStatus2(""); 
		});
	}

	function refreshBalnce(){
		var balance = web3.fromWei(web3.eth.getBalance(web3.eth.coinbase),"ether").toFixed(5);
		$("#cb_balance").html(balance); 
		$("#cb_balance1").html(balance);
		$("#cb_balance2").html(balance); 
	}

	function intialize(){
		var buyer = $("#buyer").val(); 
		var strikePrice = parseFloat($("#strikePrice").val());
		var underlyingName = $("#underlyingName").val(); 
		var underlying = parseFloat($("#underlying").val()); 
		var premium = parseFloat($("premium").val()); 
		var timeToExpiry = parseFloat($("timeToExpiry").val()); 

		setStatus("Initializing transaction //(please wait)"); 

		myContractInstance.intialize(buyer,strikePrice,underlyingName,underlying,premium,timeToExpiry,
			{function: account[0]}).then(
			function(){
				refreshVars(); 
			}); 
	}

	function validate(){
		var amount = parseFloat($("#premiumAMount").val()); 
		console.log(amount); 

		setStatus1("Initializing transaction ... (please wait)"); 

		myContractInstance.validate({from:accounts[0],value:amount}).then(
			function(){
				refreshVars();
			});
	}
	
	function exercise(){
		var amount = parseFloat($("#callAmount").val()); 
		console.log(amount); 

		setStatus2("Initializing transaction... (please wait)"); 

		myContractInstance.exercise({from:accounts[0],value:amount}).then(
			function(){
				refreshVars();
			});
	}

	window.onload = function(){
		$("#tabs").tabs(); 
		web3.eth.getAccounts(function(err,accs){
		if (err != null){
			alert("There was an error fetching your accounts."); 
			return; 
		}
		if (accs.length == 0){
			alert("Couldn't get any account! "); 
			return; 
		}
		accounts = accs;
		account = accounts[0]; 
		initializeContract();
	}); 

	}

