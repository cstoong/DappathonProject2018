pragma solidity ^0.4.24;

contract StewdentApplication {
    uint idSeq = 1000;
    address creator;
    string public url;
        
    struct Applicant{
        uint uid; 
        uint id;
        string gender;
        uint rank;
        uint cpga;
    }

    Applicant[] public applicants;
    
    constructor(
        string _url
    )public {
        creator = msg.sender;
        url = _url;
    }
    
    function apply(uint _uid, string _gender, uint _rank, uint _cgpa) payable public returns(uint){
        applicants.push(
            Applicant({
                uid : _uid,
                id : ++idSeq,
                gender : _gender,
                rank : _rank,
                cpga : _cgpa
            })
        );
        return idSeq;
    }
    
    function getApplicantCount() public constant returns(uint){
        return applicants.length;
    }

    function getApplicant(uint _index) public constant returns (uint, uint, string, uint, uint){
        return (applicants[_index].uid, applicants[_index].id, applicants[_index].gender, applicants[_index].rank, applicants[_index].cpga);
    }
    
    function update(string _url) payable public returns(string){
        url = _url;
        return url;
    }

    function getUrl() public constant returns(string){
        return url;
    }

    function contractBalance() public constant returns(uint){
        return address(this).balance;
    }

    function getIdSeq() public constant returns(uint){
        return idSeq;
    }
}