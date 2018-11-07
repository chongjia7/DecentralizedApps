contract SolarCharge
{
	 struct User 
	 {
	 string name; 
	 address userAccount; 
	 uint amountPaid; 
	 uint solcoins; 
	 }

	 mapping (bytes32 => User) public users; 

	 struct 
	 {
	 uint rate; 
	 string location; 
	 uint coinBalance; 
	 uint lastActivated; 
	 uint lastDuration; 
	 }

	 mapping (uint => Station) public stations; 

	 address public owner; 
	 uint public numUsers; 
	 uint public numStations; 
	 uint public coinRate; // coin per ether 

	 function SolarCharger()
	 {
	 owner = msg.sender; 
	 numUsers = 0; 
	 numStations = 0; 
	 coinRate = 1000000000000000000000; 
	 }

	 function registerUser(string _email, string _name) public
	 {
	 bytes32 email = stringToBytes(_email); 

	 if(users[email].userAccount > 0) { throw;}

	 Users u = user[email]; 
	 u.userAccount = msg.sender; 
	 u.name = _name; 
	 u.amountPaid; 
	 u.solcoins = 0; 
	 numUsers += 1; 
	 }

	 function buyCoins(string _email) public 
	 {

	 bytes32 email = stringToBytes(_email); 

	 if(users[email].userAccount != msg.sender){throw;}
	 
	 users[email].amountPaid += msg.value; 
	 users[email].solcoins += msg.value*coinRate; 
	 }

	 function addStation(uinit ID, uint _rate, string _location) public 
	 {
	 if(msg.sender != owner){throw;}
	 if(stations[ID].rate!= 0){throw;}

	 Station s = stations[ID]; 
	 s.coinBalance = 0; 
	 s.lastActivated = 0; 
	 s.lastDuration = 0; 
	 s.location = _location; 
	 s.rate = _rate; 
	 numStations += 1;
	 }

	 function activateStation(string _email, uint ID, uint duration) public 
	 {
	 bytes32 email = stringToBytes(_email); 
	 //Station does not exist
	 if(stations[ID].rate ==0){throw;}
	 //Station is busy 
	 if(now < (stations[ID].lastActivated+stations[ID].lastDuration)) {throw;}

	 uint coinsRequired = stations[ID].rate*duration; 

	 //User has insufficient coins 
	 if (users[email].solcoins < coinsRequired) {throw;}

	 users[email].solcoins -= coinsRequired; 
	 stations[ID].coinBalance += coinsRequired; 
	 stations[ID].lastActivated = now; 
	 stations[ID].lastDuration = duration; 
	 }

	 function getStationState(uint ID) constant returns (bool)
	 {
	 if(now <(stations[ID].lastActivated + stations[ID].lastDuration)) {return true;}
	 else{return false;}
	 }

	 function getUser(string _email) constant returns (string name, address userAccount, uint amountPaid, uint solcoins)
	 {
	 bytes32 email = stringToBytes(_email); 
	 name = users[email].name; 
	 userAccount = users[email].userAccount; 
	 amountPaid = users[email].amountPaid; 
	 solcoins = users[email].solcoins;
	 }

	 function getStation(uint ID) constant returns (uint rate, string location, uint coinBalance, uint lastActivated, unint lastDuration)
	 {
	 rate = stations[ID].rate; 
	 location = stations[ID].location; 
	 coinBalance = stations[ID].coinBalance; 
	 lastActivated = stations[ID].coinBalance; 
	 lastDuration = stations[ID].lastDuration; 
	 }

	 //Converts 'string' to 'bytes32'
	 function stringToBytes(string s) returns (bytes32)
	 {
	 bytes memory b = bytes(s); 
	 uint r = 0; 
	 for (uint i = 0; i <32; i++)
	 {
	 	if( i < b.length) {r = r | uint(b[i]);}
	 	if ( i < 31) r = r * 256; 
	 }
	 return bytes32(r); 
	 }


	 function destroy() 
	 {
	 if(msg.sender == owner) {suicide(owner);}
	 }


}
