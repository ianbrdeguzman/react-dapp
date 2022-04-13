import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import './App.css';

const greeterContractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

export default function App() {
  const [greeting, setGreeting] = useState<string>('');

  const requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  };

  const handleGetGreeting = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
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

      const provider = new ethers.providers.Web3Provider(window.ethereum);
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
      </header>
    </div>
  );
}
