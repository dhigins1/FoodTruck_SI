import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter, { history } from './routers/AppRouter';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { login, logout } from './actions/auth';
import LoadingPage from './components/LoadingPage';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/lib/css/_datepicker.css';
import { firebase } from './firebase/firebase';

const store = configureStore();

const jsx = (
  <Provider store={ store }>
    <AppRouter />
  </Provider>
);
let hasRendered = false;

const renderApp = () => {
  if(!hasRendered){
    ReactDOM.render(jsx, document.getElementById('app'));
    hasRendered = true;
  }
};

ReactDOM.render(<LoadingPage />, document.getElementById('app'));

firebase.auth().onAuthStateChanged((user) => { //this will also run the first time app is loaded or everytime it is refreshed
  if(user) {
    store.dispatch(login(user.uid));
    setTimeout(() => {
      renderApp();

      var currentUser = firebase.auth().currentUser;
      var name, email, photoUrl, uid, emailVerified;


      name = user.displayName;
      name = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;

      // console.log('currentUser', currentUser);

    }, 1500)
    // if(history.location.pathname === '/'){
    //   history.push('/dashboard');
    // }
  }
  else {
    store.dispatch(logout());
    setTimeout(() => {
      renderApp();
    }, 1500)
    // history.push('/');
  }
});
