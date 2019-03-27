import React, {
  Component
} from 'react';
import { Provider } from 'react-redux';
import configureStore from './src/main/storeConfiguration';
import Router from './src/main/Router';

class App extends Component {

  render() {
      const store = configureStore();
      return (
          <Provider store={store}>
              <Router />
          </Provider>
      );
  }
}

export default App;
