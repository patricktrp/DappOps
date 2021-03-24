import React, { useEffect, useState } from 'react';
import { VOTING_ABI } from '../../config';
import classes from './EditVoting.module.css';
import Spinner from '../../Spinner';

const EditVoting = ( {web3} ) => {

    const [userAddress, setUserAddress] = useState();
    const [address, setAddress] = useState("");
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [authorizeAddress, setAuthorizeAddress] = useState("");
    const [addingVotingOption, setAddingVotingOption] = useState("");

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

    const submitAddressHandler = async (e) => {
        setLoading(true);
        e.preventDefault();
        const contract = new web3.eth.Contract(VOTING_ABI, address);
        const isUserOwner = await contract.methods.AmIOwner().call();
        if(isUserOwner) {
            setIsOwner(true);
        }

        setLoading(false);
    }

    const authorizeSomebody = async (e) => {
        e.preventDefault();
        if (!authorizeAddress) return;
        console.log(authorizeAddress);
        const contract = new web3.eth.Contract(VOTING_ABI, address);
        try {
            const res = await contract.methods.authorize(authorizeAddress).send({ from: userAddress });
            console.log(res);
        } catch (error) {
            console.log(error);   
        }
        setAuthorizeAddress("");
        alert(`authorized ${authorizeAddress}`);
    }

    const addVotingOption = async (e) => {
        e.preventDefault();
        if(!addingVotingOption) return;
        const contract = new web3.eth.Contract(VOTING_ABI, address);
        try {
            const res = await contract.methods.addVotingOption(addingVotingOption).send({ from: userAddress });
            console.log(res);
        } catch (error) {
            console.log(error);   
        }
        setAddingVotingOption("");
        alert(`added ${addingVotingOption} as a Voting Option`);
    }

    let EditForms = null;
    if(loading) {
        EditForms = <Spinner />
    } else if(isOwner) {
        EditForms = (
            <>
            <h2>Succerssfully connected to the Smart Contract!</h2>
            <p>Authorize someone to vote</p>
            <form onSubmit={e => authorizeSomebody(e)}>
                <input type="text" onChange={e => setAuthorizeAddress(e.target.value)} value={authorizeAddress}></input>
                <button>Authorize</button>
            </form>
            <p>Add a Voting Option</p>
            <form onSubmit={e => addVotingOption(e)}>
            <input type="text" onChange={e => setAddingVotingOption(e.target.value)} value={addingVotingOption}></input>
            <button>Add</button>
            </form>
            <button>End Voting</button>
            </>
        )
    }

    return(
        <div className={classes.EditVoting}>
            <p>Enter the address of the Smart Contract you want to edit:</p>
            <form onSubmit={submitAddressHandler}>
                <input type="text" onChange={e => setAddress(e.target.value)} value={address}></input>
                <button>Connect</button>
            </form>
            {EditForms}
        </div>
    );
};

export default EditVoting;