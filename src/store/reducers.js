import { combineReducers } from 'redux';

import { connectRouter } from 'connected-react-router'
import { reducer as formReducer } from 'redux-form';
import { reducers as ocReducers } from '@openchemistry/redux';
import { auth, admin, user } from '@openchemistry/girder-redux';

const createRootReducer = (history) => combineReducers({
  molecules: ocReducers.molecules,
  calculations: ocReducers.calculations,
  girder: ocReducers.girder,
  app: ocReducers.app,
  cumulus: ocReducers.cumulus,
  jupyterlab: ocReducers.jupyterlab,
  auth: auth.reducer,
  router: connectRouter(history),
  form: formReducer,
  configuration: ocReducers.configuration,
  admin: admin.reducer,
  user: user.reducer,
  images: ocReducers.images,
});

const authSelector = (state) => state.auth;
auth.selectors.setRoot(authSelector);

export default createRootReducer;
