import React from "react";
import { Container } from 'semantic-ui-react'
import "semantic-ui-css/semantic.min.css";
import {BrowserRouter as Router,Route} from "react-router-dom";
import './App.css';
import MenuBar from "./components/MenuBar";

import {AuthProvider} from "./context/auth";
import AuthRoute from "./util/AuthRoute";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";


function App() {
  return (
    <AuthProvider>
      <Router>
      <Container>
      <MenuBar/>
      <Route exact path="/" component={Home}/>
      <AuthRoute exact path="/login" component={Login}/>
      <AuthRoute exact path="/register" component={Register}/>
      <Route exact path="/posts/:postID" component={SinglePost}/>
      </Container>
    </Router>
    </AuthProvider>
  );
}

export default App;
