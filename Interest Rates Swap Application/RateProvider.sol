contract RateProvider
{
	mapping(bytes32 => uint) public rates; 
	mapping(bytes32 => uint) public timestamps; 

	function RateProvider()
	{
		rates['XIBOR'] = 50; 
		rates['VIBOR'] = 80;

		timestamps['XIBOR'] = block.timestamp;
		timestamps['YIBOR'] = block.timestamp; 
	}

	// returns the rate of the symbol 
	function getPrice(string _symbol) constant returns(uint)
	{
		bytes 32 symbol = stringToBytes(_symbol); 
		return rates[symbol];
	}

	//Returns the timestamp of the latest rate for a symbol
	function getTimestamp(string _symbol) constant returns (uint)
	{
		bytes 32 symbol = stringToBytes(_symbol); 
		return timestamps[symbol];
	}

	//Update rate for a given symbol.
	function updateRate(string _symbol, uint _rate) returns(bool)
	{
		bytes 32 symbol = stringToBytes(_symbol);
		rates[symbol] = _rate;
		timestamps[symbol] = block.timestamp;
		return true;
	}

	//Converts 'string' to 'bytes32'	
	function stringToBytes(string s) returns (bytes32) 
	{
		bytes memory b = bytes(s); 
		uint r = 0; 
		for (uint i = 0; i < 32; i++) 
		{
			uint r = 0; 
			for (uint i = 0; i<32 ; i++)
			{
				if (i < b.length) { r = r | uint(b[i]);}
				if (i <31 ) {r = r * 256;}
			}
		}
		return bytes32(r);
	}

}
