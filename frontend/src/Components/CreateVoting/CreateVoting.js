import classes from './CreateVoting.module.css';
import React, {useState, useEffect} from 'react';
import { VOTING_ABI, BYTECODE } from '../../config';

const CreateVoting = ({ web3 }) => {

    const [heading, setHeading] = useState("");
    const [userAddress, setUserAddress] = useState();
    const [deployedAddress, setDeployedAddress] = useState();


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

    const copyHandler = () => {
      navigator.clipboard.writeText(deployedAddress);
    }

    const deployContractHandler = async e => {
      e.preventDefault();
      let SampleContract = new web3.eth.Contract(VOTING_ABI);
      let code = `0x${BYTECODE.object}`;

      SampleContract.deploy({
        data: code,
        arguments: [heading]
      }).send({
        from: userAddress
      }).then(res => {
        setDeployedAddress(res._address);
      })

    }

    let deployed = null;
    if(deployedAddress) {
      deployed = (
      <>
        <p>Your contract was successfully deployed at: </p>
        <p className={classes.deployed}>{deployedAddress}</p>
        <button onClick={copyHandler}>Copy to clipboard</button>
      </>
      );
    }

    return(
      <div className={classes.CreateVoting}>
        <p>Enter the title of the Voting:</p>
        <form onSubmit={(e) => deployContractHandler(e)}>
          <input type="text" onChange={e => setHeading(e.target.value)} value={heading}></input>
          <button>Deploy</button>
        </form>
        {deployed}
      </div>
    );
};

export default CreateVoting;