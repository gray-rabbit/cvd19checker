import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import MainPage from './MainPage';
import TestPage from './TestPage';
import SetupPage from './SetupPage';

//App의 진입점을 하자

function App() {
  console.log('app')
  return (
    <>
      <Router>
        <div>
          <Link to='/'>메인으로</Link>
          <Link to='/setting'>테스트로</Link>
        </div>
        <Switch>
          <Route exact path='/' component={TestPage} />
          <Route path='/setting' component={SetupPage} />
          {/* <Route exact path='/' component={MainPage} /> */}
        </Switch>
      </Router>
    </>
  );
}

export default App;
