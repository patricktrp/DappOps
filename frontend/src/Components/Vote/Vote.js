import {useState, useEffect} from 'react';
import Spinner from '../../Spinner'
import classes from './Vote.module.css';
import {VOTING_ABI} from '../../config';

const Vote = ({ web3 }) => {

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [votingOptions, setVotingOptions] = useState();
  const [votingHeading, setVotingHeading] = useState(null);
  const [authorized, setAuthorized] = useState(null);
  const [voted, setVoted] = useState();
  const [userAddress, setUserAddress] = useState();

  useEffect(() => {
    let account;
    web3.eth.getAccounts()
      .then(res => {
        account = res[0];
        setUserAddress(account);
      })
      .catch(err => {
        console.log(err)
      });
  }, []);
  
  const submitAdress = async e => {
    e.preventDefault();
    await connectToSmartContract();
  }

  const connectToSmartContract = async () => {
    if(!address) {
      return;
    }

    setLoading(true);
    
    const contract = new web3.eth.Contract(VOTING_ABI, address);

    const electionName = await contract.methods.electionName().call();
    setVotingHeading(electionName);

    const authorizedToVote =  await contract.methods.AmIAuthorized().call();
    setAuthorized(authorizedToVote);

    const alreadyVoted = await contract.methods.HaveIVoted().call();
    setVoted(alreadyVoted);

    const numVotingOptions = await contract.methods.getNumVotingOptions().call();
    const votingOptions = [];

    for(let i=0; i < numVotingOptions; i++) {
      const res = await contract.methods.votingOptions(i).call();
      const votingOption = {};
      votingOption.index = i;
      votingOption.description = res.description;
      votingOption.votes = Number.parseInt(res.votes);
      votingOptions.push(votingOption);
    }
    setVotingOptions(votingOptions);
    
    setLoading(false);
  }

  const vote = async (e, index) => {
    const contract = new web3.eth.Contract(VOTING_ABI, address);
    const res =  await contract.methods.vote(index).send({from: userAddress});
    if(res?.status) {
      connectToSmartContract();
    }
  }



  let votingOptionList = null;
  if(loading) {
    votingOptionList = <Spinner />;
  } else {
    let votingButton = null;

    votingOptionList = votingOptions ? votingOptions.map(option => {
      if(!voted && authorized) {
        votingButton = <button onClick={e => vote(e, option.index)}>Vote</button> 
      }
      return (
        <div key={option.index} className={classes.VotingOption}> 
          <p>{option.description}</p>
          <p>Total Votes: {option.votes}</p>
          {votingButton}
        </div>
      )}) : null
    }

    let auth = null;
    if(authorized && voted) {
      auth = <p className={classes.voteGreen}>You successfully voted!</p>;
    } else if(authorized && !voted) {
      auth = <p className={classes.voteGreen}>You're authorized to vote!</p>;
    } else if (authorized === false) {
      auth = <p className={classes.voteRed}>You're not authorized to vote!</p>;
    }

  return(
    <div className={classes.Vote}>
    <p>Enter the address of the Smart Contract you want to interact with:</p>
      <form onSubmit={e => submitAdress(e)}>
          <input type="text" onChange={(e) => setAddress(e.target.value)} value={address} />
          <button>Submit</button>
      </form>
      {votingHeading ? <h2>{votingHeading}</h2> : null}
      {auth}
      {votingOptionList}
    </div>
  );
};

export default Vote;