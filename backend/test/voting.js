const Voting = artifacts.require("Voting");

contract('Voting', (accounts) => {
    const addressOwner = accounts[0];
    const address1 = accounts[1];
    const address2 = accounts[2];

    let voting = null;
    before(async () => {
        voting = await Voting.deployed();
    });

    it('Should deploy contract properly', async () => {
        assert(voting.address !== '');
    });

    it('Owner should be set properly', async () => {
        const owner = await voting.owner();
        assert(owner === addressOwner);
    });

    it('Owner initially not authorized', async () => {
        const result = await voting.AmIAuthorized();
        assert(result === false)
    });

    it('Voting Options initially empty', async () => {
        const result = await voting.getNumVotingOptions();
        const res = result.toNumber();
        assert(res === 0);
    }); 

    it('Should add a Voting Option properly', async () => {
        await voting.addVotingOption("test");
        const numVotingOptions = await voting.getNumVotingOptions();
        const votingOption = await voting.votingOptions(0);
        assert(votingOption.description === 'test');
        assert(votingOption.votes.toNumber() === 0);
        assert(numVotingOptions.toNumber() === 1);
    }); 

    it('Other people should not be able to add Voting Options', async () => {
        try {
            await voting.addVotingOption("test", {from: address1});
        } catch (error) {
            assert(error.message.includes("youre not the owner"));
            return;
        }
        assert(false);
    });

    it('Should not be able to vote without being authorized', async () => {
        try {
            await voting.vote(0);
        } catch (error) {
            assert(error.message.includes("not authorized"));
            return;
        }
        assert(false);
    });

    it('Owner should be able to authorize someone to vote', async () => {
        const resBefore = await voting.AmIAuthorized({from: address1});
        await voting.authorize(address1);
        const resAfter = await voting.AmIAuthorized({from: address1});
        assert(resBefore === false);
        assert(resAfter === true);
    });

    it('Authorized user should be able to vote', async () => {
        const res = await voting.vote(0, {from: address1});
        assert(res.receipt.from.toUpperCase() === address1.toUpperCase());
        assert(res.receipt.status === true);
    });

    it('Authorized user should not be able to vote twice', async () => {
        try {
            await voting.vote(0, {from: address1});
        } catch (error) {
            assert(error.message.includes("already voted"));
            return;
        }
        assert(false);
    });

    it('Other people should not be able to authorize someone to vote', async () => {
        try {
            await voting.authorize(address2, {from: address1});
        } catch (error) {
            assert(error.message.includes("youre not the owner"));
            return;
        }
        assert(false);
    });

    it('Someone other than owner should not be able to end Voting', async () => {
        try {
            await voting.end({from: address1});
        } catch (error) {
            assert(error.message.includes("youre not the owner"));
            return;
        }
        assert(false);
    });

    it('Owner should be able to end Voting', async () => {
        const res = await voting.end();
        assert(res.receipt.status);
    });

    it('Should not be able to interact with Smart Contract after Voting has ended', async () => {
        try {
            await voting.electionName();
        } catch (error) {
            assert(error.message.includes("Returned values aren't valid"));
            return;
        }
        assert(false);
    });
});