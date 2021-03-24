pragma solidity ^0.5.16;

contract Voting {
    
    address payable public owner;
    string public electionName;
    uint public totalVotes;
    
    struct VotingOption {
        string description;
        uint votes;
    }
    
    struct Voter {
        bool authorized;
        bool voted;
        uint voteIndex;
    }

    mapping(address => Voter) public voters;
    
    VotingOption[] public votingOptions;
    
    modifier ownerOnly() {
        require(
            msg.sender == owner,
            'youre not the owner'
        );
        _;
    }
    
    constructor(string memory _name) public {
        owner = msg.sender;
        electionName = _name;
    }
    
    function addVotingOption(string memory _name) ownerOnly public {
        votingOptions.push(VotingOption(_name, 0));
    }
    
    function getNumVotingOptions() public view returns(uint) {
        return votingOptions.length;
    }
    
    function authorize(address _person) ownerOnly public{
        voters[_person].authorized = true;
    }
    
    function vote(uint _voteIndex) public {
        require(
             !voters[msg.sender].voted,
             "already voted"
        );
        require(
             voters[msg.sender].authorized,
             "not authorized"
        );
        
        voters[msg.sender].voted = true;
        voters[msg.sender].voteIndex = _voteIndex;
        
        votingOptions[_voteIndex].votes += 1;
        totalVotes += 1;
    }

    function AmIAuthorized() public view returns(bool) {
        return voters[msg.sender].authorized;
    }
    
    function HaveIVoted() public view returns(bool) {
        return voters[msg.sender].voted;
    }
    
    function AmIOwner() public view returns(bool) {
        return msg.sender == owner;
    }
    
    
    
    function end() ownerOnly public {
        selfdestruct(owner);
    }
}