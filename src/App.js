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
        <div className="is-flex" style={{ justifyContent: 'space-around' }}>
          <Link to='/' className="button is-small">메인</Link>
          <Link to='/setting' className="button is-small">설정으로</Link>
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
