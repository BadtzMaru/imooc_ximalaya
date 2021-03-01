import storage, {load} from '@/config/storage';
import axios from 'axios';
import {Effect, Model, SubscriptionsMapObject} from 'dva-core-ts';
import Toast from 'react-native-root-toast';
import {Reducer} from 'redux';
import {goBack} from '../utils';

const USER_URL = '/mock/11/bear/login';

export interface IUser {
  name: string;
  avatar: string;
}

export interface UserModelState {
  user?: IUser;
}

export interface UserModel extends Model {
  namespace: 'user';
  state: UserModelState;
  effects: {
    login: Effect;
    logout: Effect;
    loadStorage: Effect;
  };
  reducers: {
    setState: Reducer<UserModelState>;
  };
  subscriptions: SubscriptionsMapObject;
}

const initialState = {
  user: undefined,
};

const userModel: UserModel = {
  namespace: 'user',
  state: initialState,
  reducers: {
    setState(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    *login({payload}, {call, put}) {
      const {data, status, msg} = yield call(axios.post, USER_URL, payload);
      if (status === 200) {
        yield put({
          type: 'setState',
          payload: {
            user: data,
          },
        });
        storage.save({
          key: 'user',
          data,
        });
        Toast.show('登录成功', {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
        });
        goBack();
      } else {
        Toast.show(msg, {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
        });
        console.log(msg);
      }
    },
    *logout(_, {put}) {
      yield put({
        type: 'setState',
        payload: {
          user: undefined,
        },
      });
      storage.save({
        key: 'user',
        data: null,
      });
    },
    *loadStorage(_, {call, put}) {
      try {
        const user = yield call(load, {key: 'user'});
        yield put({
          type: 'setState',
          payload: {
            user,
            data: undefined,
          },
        });
      } catch (error) {
        console.log('保存用户信息错误: ', error);
      }
    },
  },
  subscriptions: {
    setup({dispatch}) {
      dispatch({
        type: 'loadStorage',
      });
    },
  },
};

export default userModel;
