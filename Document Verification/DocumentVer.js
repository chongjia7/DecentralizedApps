var accounts; 
var account; 
var myContractInstance; 
var docHash; 

$("#").html()

function initializeContract()
{
	myContractInstance = DocVerify.deployed(); 
	$("#cf_address").html(myContractInstance.address);
	$("#cb_address").html(account);

	myContractInstance.numDocuments.call().then(
		function(numDocuments)
		{
			$("#cf_documents").html(numDocuments.toNumber());
			refreshBalance(); 
		});
}

function setStatus(message)
{
	$("#status").html(message);
};

function showTotal()
{
	var numTickets = $("#numTickets").val();
	var ticketAmount = numTickets * ticketPrice;
	$("#ticketsTotal").html(ticketAmount);
}; 

function refreshBalance()
{
	$("#cb_balance").html(web3.fromWei(web3.eth.getBalance(web3.eth.coinbase)."ethere").tofixed(5));
}

function progress (p) 
{
	var w = ((p*100).toFixed(0));
}

function finished(result) 
{
	console.log(result.toString(CryptoJSH.enc.Hex))
	docHash = result.toString(CryptoJSH.enc.Hex); 
	$("#docHash").html(docHash);
	setStatus("Hash calculation done"); 
}

function calculatedHash()
{
	setStatus("Calculating Hash"); 
		var file = document.getElementById('fileUpload').files[0]
		var reader = new FileReader(); 
		reader.onload = function(e) 
						{
							var data = e.target.result; 
							var res = CryptoJSH.SHA256(data,progress, finished); 
						}; 
		reader.readAsBinaryString(file)
}

function submitDocument()
{
	setStatus("Submitting document ... (please wait)"); 

	myContractInstance.newDocument(docHash, 
		{from: web3.eth.coinbase}).then(
		function(results)
		{
			return myContractInstance.numDocuments.call(); 
		}).then(
		function(numDocuments) {
			$("#cf_documents").html(numDocuments.toNumber());
			return myContractInstance.documentExists.call(docHash);
		}).then(
		function(exists) {
			if (exists) {setStatus("Document hash submitted");}
			else { setStatus("Error in submitting document hash");}
			refreshBalance(); 
		});
}

function verifyDocument()
{
	setStatus("Verifying document ... (please wait)"); 

	myContractInstance.documentExists.call(docHash).then(
		function(exists)
		{
			if(exists)
			{
				myContractInstance.getDocument.call(docHash).then(
					function (result)
					{
						var theDate = new Date(result[0].toNumber() * 1000); 
						dateString = theDate.toGMTString(); 
						var res "Document Registered: " + dateString + "<br>Document Owner: "+result[1]; 
						setStatus(res); 
					});} 
			else {setStatus("Document cannot be verified");}
			refreshBalance();
		});
}

window.onload = function() 
{
	web3.eth.getAccounts(
		function(err,accs)
		{
			if (err != null) {alert("There was an error fetching your accounts."); return;}
			if (accs.length == 0) {alert.("Couldn't get any accounts!"); return;}
			account = accs; 
			account = accounts[0]; 
			initializeContract();
		});
}