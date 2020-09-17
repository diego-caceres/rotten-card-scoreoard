import React from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.scss';
import Game from './components/Game';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <label> La Podrida | El Difícil </label>
      </header>
      <div className="App-body">
        <ToastContainer
                  position={toast.POSITION.TOP_RIGHT}
                  autoClose={5000}
                  transition={Slide}
                  hideProgressBar
                  closeOnClick
                />

        <Game />
      </div>
    </div>
  );
}

export default App;
