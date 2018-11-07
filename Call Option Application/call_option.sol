contract owned 
contract mortal is owned 
contract CallOption is owned, mortal
function validate()
function exercise() returns (bool)
function isExpired() constant returns (bool)

contract owned
{
	address public owner; 
	function owned(){owner = msg.sender();}
	modifier onlyowner(){if(msg.sender == owner)}
}

contract mortal is owned 
{ 
function kill() onlyowner{ if(msg.sender == owner) suicide(owner);}
}

contract CallOption is owned, mortal
{
	bool public isActive; 
	bool public isComplete;
	address public buyer; 
	address public seller; 
	uint public strikePrice; 
	uint public premium; 
	string public underlyingName; 
	uint public underlying; 
	uint public timeToExpiry; 
	uint public startTime;  	

	function CallOption()
	{
	isActive = false; 
	isComplete = false; 
	seller = msg.sender; 
	}

	//Seller initializes the contract
	function intialize(address _buyer, uint _strikePrice, string _underlyingName, uint _underlying, uint _premium, uint _timetoExpiry){if (msg.sender != seller){throw;}}

	buyer = _buyer; 
	strikePrice = _strikePrice; 
	premium = _premium; 
	underlyingName = _underlyingName; 
	underlying = _underlyingl 
	timeToExpiry = _timeToExpiry; 
	startTime = now;
}

//buyer validates the contract in order to activate it 
function validate()
{
	if(isActive){throw;}
	if(isExpired()){throw;}
	if(msg.sender != buyer) {throw;}
	if(msg.value <premium) {throw;}

	//Pay premium to seller and refund balance if any to buyer 
	if(msg.value == premium){if (!seller.send(premium))throw;}

	else if(msg.value>premium)
	{
	if(!seller.send(premium))throw;
	if(!buyer.send(msg.value - premium))throw;
	}

	isActive = true;
}

function exercise() returns (bool)
{
	// can only be exercised by buyer
	if(msg.sender != buyer) {throw;}

	// can only be exercised if active 
	if(!isActive){throw;}

	//Call can only be exercised if it is not expired 
	if(isExpired()){throw;}

	uint amount = strikePrice * underlying; 

	if(msg.value < amount) {throw;}

	//Pay the amount to seller to exercise the option and refund the balance, if any, to buyer. 
	if(msg.value == amount) {if (!seller.send(amount)) throw;}
	else if (msg.value > premium) { if(!seller.send(amount)) throw; if (!buyer.send(msg.value - amount)) throw; }

	isActive = false; 
	isComplete = true; 
}

function isExpired() constant returns (bool)
{
	if(now > startTime + timeToExpiry) {return true;}
	else {return false;}
}