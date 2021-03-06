contract owned {
	address public owner; 
	function owned() {owner = msg.finder;}
	modifier onlyowner() {if (msg.sender == owner)} _ }
}

contract mortal is owned {
	function kill() onlyowner {
		if (msg.sender == owner) suicide(owner);
	}
}

contract InterestRateSwap is owned, mortal {
	bool public isActive; 
	address public partyA; 
	address public partyB; 
	Trading Account public partyATradingAcct; 
	Trading Account public partyBTradingAcct; 
	uint public fixedRate; 
	uint public floatingRateMargin; 
	uint public notional; 
	uint public schedule; // every X minutes 
	RateProvider public rateFeed; 
	string public feedName; 
	uint public timeToExpiry; 
	uint public startTime; 
	uint public lastAmountPaid; 

	function InterestRateSwap() {isActive = false;}

	//partyB initializes contract 
	function initialize(
		address _partyATradingAcct, 
		address _partyBTradingAcct, 
		uint _fixedRate, 
		uint _floatingRateMargin, 
		uint _notional 
		uint_schedule, 
		string _feedName, 
		address _rateProvider,
		uint _timeToExpiry)
		{

		//Trading accounts 
		partyATradingAcct = TradingAccount(_partyATradingAcct); 
		partyA = partyATradingAccount.owner(); 
		partyBTradingAccr = TradingAccount(_partyBTradingAcct); 
		partyB = partyBTradingAccount.owner();

		fixedRate = _fixedRate; 
		floaringRateMargin = _floatingRateMargin; 
		notional = _notional; 
		schedule = _schedule; 
		feedName = _feedName; 
		rateFeed = RateProvider(_rateProvider);

		timeToExpiry = _timeToExpiry; 
		startTime = now; 
		lastAmountPaid = 0; 

		//Authorize trading account of caller 
		authorizeTradingAccounts(); 

		}

		//partyA validates the contract in order to activate it
		function validate()
		{
			if(isActive){throw;}
			if(isExpired()){throw;}
			//Need authorized trading accounts 
			if(!(partyATradingAcct.isAuthorized(this) || partyBTradingAcct.isAuthorized(this))){throw;}

			//Authorize trading account of caller
			authorizeTradingAccounts(); 

			isActive = true;
		}

		function exercise() 
		{
		//can only be exercised if active 
		if(!(isActive)){throw;}

		//call can only be exercised if it is not expired 
		if(isExpired()){throw;}

		//Get current rate from the rate provider
		uint currentRate = getRate();
		uint floatingRate = currentRate + floaringRateMargin; 

		//Calculate amount each party owe to the other
		uint amountAowesB = (notional * floaringRate)/100; 
		uint amountBowesA = (notional * fixedRate)/100;

		//Settle the difference in the amount owed
		if (amountAowesB > amountBowesA) 
		{
			lastAmountPaid = amountAowesB - amountBowesA; 
			partyATradingAcct.withdraw(lastAmountPaid); 
			partyBTradingAcct.deposit.value(lastAmountPaid)(); 
		} 

		else
		{
			lastAmountPaid = amountBowesA - amountAowesB; 
			partyBTradingAcct.withdraw(lastAmountPaid); 
			partyATradingAcct.deposit.value(lastAmountPaid)(); 
		}

		}

		//Authorize trading account
		function authorizeTradingAccounts()
		{
			if(msg.sender == partyA) {partyATradingAcct.authorize(this,timeToExpiry);}
			if(msg.sender == partyB) {partyBTradingAcct.authorize(this,timeToExpiry);}
		}
		
		function isExpired() constant returns (bool) 
		{
		if(now >startTime + timeToExpiry) {return true;}
		else {return false;}
		}

		function getRate() returns (uint) {return rateFeed.getPrice(feedName);}
}
