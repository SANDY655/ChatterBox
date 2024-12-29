import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";
import ChatProvider from "./Context/ChatProvider";

function App() {
  return (
    
      <ChatProvider>
        <Router>
          <Switch>
            {/* Home Page */}
            <Route exact path="/" component={HomePage} />
            
            {/* Chat Page */}
            <Route path="/chats" component={ChatPage} />
          </Switch>
        </Router>
      </ChatProvider>
    
  );
}

export default App;