var accounts; 
var account; 
var balance; 
var ticketPrice; 
var myContractInstance;

function initializeContract()
{
	myContractInstance = SolarCharger.deployed(); 
	$("#cf_address").html(myContractInstance.address);
	$("#cb_address").html(account);
	refreshVars();
}

function setStatus(message) 
{
	$("#status").html(message);
}

function refreshBalance()
{
	$("#cb_balance").html(web3.fromWei(web3.eth.getBalance(web3.eth.coinbase),"ether").toFixed(5)); 
}

function refreshVars()
{
	myContractInstance.numUsers.call().then(
		function(numUsers)
		{
			$("#cf_users").html(numUsers.toNumber());
			return myContractInstance.numStations.call();
		}).then(
		function(numStations)
		{
			$("#cf_stations").html(numStations.toNumber());
			return myContractInstance.coinRate.call()
		}).then(
		function(coinRate)
		{
			$("#cf_RATE").html(coinRate.toNumber());
			refreshBalance();
		}); 
}

function registerUser()
{
	var name = $("#name").val();
	var email = $("#email").val();
	setStatus("Initiating transaction ... (please wait)"); 

	myContractInstance.registerUser(email, name, {from: web3.eth.coinbase, gas: 2000000}).then(function(result){setStatus("Done!");refreshVars();});
}

function buyCoins()
{
	var amount = parseFlaor($("#amount").val()); 
	var email = $("#email1").val(); 

	setStatus("Initiating transaction ... (please wait)"); 

	myContractInstance.buyCoins(email, {from: web3.eth.coinbase, value: amount, gas: 2000000}).then(
		function (result)
		{
			setStatus("Done!"); 
			refreshVars(); 
		}); 
}

window.onload = function() 
{
	web3.eth.getAccounts(function(err,accs) 
	{
		if (err ! = null) { alert("There was an error fetching your accounts."); return; }
		if (accs.length == 0) { alert("Couldn't find any accounts!"); return; }

		accounts = accs; 
		account = accounts[0]; 
		initializeContract();
	});
}























