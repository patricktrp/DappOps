import { Route, NavLink, Redirect } from 'react-router-dom';
import Vote from './Components/Vote/Vote';
import Web3 from 'web3';
import classes from './App.module.css';
import CreateVoting from './Components/CreateVoting/CreateVoting';
import EditVoting from './Components/EditVoting/EditVoting';

const App = () => {

  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

  return (
    <>
      <nav className={classes.Navbar}>
        <ul>
          <li><NavLink to="/vote">Vote</NavLink></li>
          <li><NavLink to="/create-voting">Create Voting</NavLink></li>
          <li><NavLink to="/edit-voting">Edit Voting</NavLink></li>
        </ul>
      </nav>

    <Redirect from="/" to="/vote" />
    <Route path="/vote" exact component={() => <Vote web3={web3}/>} />
    <Route path="/create-voting" exact component={() => <CreateVoting web3={web3}/>} />
    <Route path="/edit-voting" exact component={() => <EditVoting web3={web3}/>} />
  </>
  );
}

export default App;
