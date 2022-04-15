import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import './App.css';
import MyERC20Token from './artifacts/contracts/MyERC20Token.sol/MyERC20Token.json';

const greeterContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const myERC20TokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export default function App() {
  const [greeting, setGreeting] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  };

  const getProvider = async () =>
    new ethers.providers.Web3Provider(window.ethereum);

  const handleGetGreeting = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = await getProvider();
      console.log('Provider:', provider);

      const contract = new ethers.Contract(
        greeterContractAddress,
        Greeter.abi,
        provider
      );

      console.log('Contract:', contract);
      try {
        const data = await contract.greet();
        console.log('Data:', data);
      } catch (error) {
        console.log('Error:', error);
      }
    }
  };

  const handleSetGreeting = async () => {
    if (!greeting) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();

      const provider = await getProvider();
      console.log('Provider:', provider);

      const signer = provider.getSigner();
      console.log('Signer:', signer);

      const contract = new ethers.Contract(
        greeterContractAddress,
        Greeter.abi,
        signer
      );
      console.log('Contract:', contract);

      const transaction = await contract.setGreeting(greeting);
      console.log('Transaction:', transaction);

      await transaction.wait();
      handleGetGreeting();
    }
    setGreeting('');
  };

  const handleGetBalance = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      const provider = await getProvider();
      const contract = new ethers.Contract(
        myERC20TokenAddress,
        MyERC20Token.abi,
        provider
      );
      const balance = await contract.balanceOf(account);
      console.log('MyERC20Token balance: ', balance.toString());
    }
  };

  const handleSendToken = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = await getProvider();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        myERC20TokenAddress,
        MyERC20Token.abi,
        signer
      );
      const transaction = await contract.transfer(address, amount);
      await transaction.wait();
      console.log(`You've successfully sent ${amount} MET to ${address}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="text"
          onChange={(e) => setGreeting(e.target.value)}
          value={greeting}
        />
        <div className="App-buttons">
          <button onClick={handleGetGreeting}>Get Greeting</button>
          <button onClick={handleSetGreeting}>Set Greeting</button>
        </div>
        <br />
        <input
          type="text"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          placeholder="Address"
        />
        <input
          type="text"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          placeholder="Amount"
        />
        <div className="App-buttons">
          <button onClick={handleGetBalance}>Get Token Balance</button>
          <button onClick={handleSendToken}>Send Token</button>
        </div>
      </header>
    </div>
  );
}
