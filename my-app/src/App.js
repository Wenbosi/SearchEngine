import './App.css';
import * as React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Result from './components/result.tsx'
import MainSearch from './components/mainSearch.tsx'

function App() {
  return (   
    <Router>
      <Route exact path="/" component={MainSearch} /> 
      <Route exact path="/keyword=:name" component={Result} />
    </Router>
  );
}

export default App;
