contract TradingAccount {
	struct AuthPeriod {
		uint duration; // in minutes
		uint startTime; 
	}

	mapping(address => AuthPeriod) public authorizedl 
	address[] public addresses; 
	address public owner; 

	function TradingAccount(){owner = msg.sender;}

	function deposit() returns (bool) 
	{
		if (isOwner(msg.sender) || isAuthorized(msg.sender)){return true;//accept deposit}
		else {throw;}
		return false; 
	}
	
	function withdraw(uint amount) returns (bool)
	{
		if(amount > this.balance){throw;} 

		if (isOwner(msg.sender) || isAuthorized(msg.sender))
		{
			if(!msg.sender.send(amount)){throw;}
			return true;
		}

		return false; 
	}

	function authorize(address accountAddr, uint duration) returns (bool) 
	{
		if(duration == 0){return false;}

		AuthPeriod period = authorized[accountAddr]; 
		if (period.duration == 0)
		{
		//Add this account to the list of authorized accounts
		authorized[accountAddr] = AuthPriod(duration,block.timestamp);
		addresses.push(accountAddr);
		}

		else if (timeRemaining(accountAddr) < duration)
		{
		//Extend the authorized duration for this account 
		authorized[accountAddr] = AuthPeriod(duration,block.timestamp);
		}

		return true; 
	}

	function isAuthorized(address accountAddr) returns (bool) 
	{
		//check if address is authorized and 
		// authorization has not expired 
		if (authorized[accountAddr].duration > 0 && timeRemaining(accountAddr) >= 0) { return true; }
		else {return false;}
	}

	function isOwner(address accountAddr) returns (bool) 
	{
	//Check if address is authorized and 
	// authorization has not expired
	if (accountAddr == owner){returns true;}
	else {return false;}
	}

	function timeRemaining 9address accountAddr) private returns (uint) 
	{
		uint timeElapsed = (block.timestamp - authorized[accountAddr].startTime)/60; 
		return authorized[accountAddr].duration - timeElapsed;
	}

	function kill() { if(msg.sender == owner) suicide (owner);}
	
}
