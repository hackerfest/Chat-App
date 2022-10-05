import { Route } from 'react-router-dom';
import './App.css';
import { ChatState } from './context/ChatProvider';
import Chat from './pages/Chat';
import Home from './pages/Home';

function App() {
  // const a=ChatState();
  // console.log(a);
  return (
    <div className="App">
      <Route path ="/" component={Home} exact/>
      <Route path="/chat" component={Chat} />
    </div>
  );
}
export default App;
