import './App.css';
import Sidebar from "./components/Navbar"
import { Route,BrowserRouter as Router, Switch } from 'react-router-dom';
import ChatBot from './pages/chatBot';
import AttackSearchEngine from './pages/AttackSearchEngine';

function App() {
  return (
    <div className="App">
      <Router>
        <Sidebar/>
        <Switch>
          <Route path='/' component={AttackSearchEngine} exact/>
          <Route path='/chatBot' component={ChatBot} />
        </Switch>
      </Router>  
    </div>
  );
}

export default App;