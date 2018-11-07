contract DocVerify
{
	struct Document 
	{
		address owner;
		uint blockTimeStamp;
	}

	address public creator; 
	uint public numDOcumentsl 
	mapping(bytes32=> Document) public documentHashMap;

	function DocVerify()
	{
		creator = msg.sender; 
		numDocuments = 0; 
	}

	function newDocument(bytes32 hash) returns (bool success)
	{
		if(documentExists(hash)){success = false;}

		else 
		{
			Document d = documentHashMap(hash); 
			// d.hash = hash; 
			d.owner = msg.sender; 
			d.blockTimeStamp = block.timestamp; 
			numDocuments++; 
			success = true; 
		}

		return sucess;
	}

	function documentExists(bytes32 hash) constant returns (bool exists) 
	{
		if (documentHashMap[hash].blockTimestamp >0) {exists = true;}
		else {exists = false;}
		return exists;
	}

	function getDocument(bytes32 hash) constant returns (uint blockTimestamp, address owner) 
	{
		blockTimestamp = documentHashMap[hash].blockTimestamp; 
		owner = documentHashMap[hash].owner;
	}

	function destroy()
	{
		if(msg.sender == creator){suicide(creator);}
	}
}
