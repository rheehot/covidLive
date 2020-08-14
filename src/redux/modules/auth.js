import SigninService from '../../services/SigininService'
import TokenService from '../../services/TokenService' 

// actions
const LOGIN_START = 'LOGIN_START'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGIN_FAIL = 'LOGIN_FAIL'
const LOGOUT = 'LOGOUT'

function loginStart() {
  return {
    type : LOGIN_START
  }
}

function loginSuccess(token, nickname) {
  return {
    type : LOGIN_SUCCESS,
    token,
    nickname
  }
}

function loginFail(error) {
  return {
    type : LOGIN_FAIL,
    error
  }
}


export function logout() {
  return{
    type : LOGOUT
  }
}

// reducer

const initialState = {
  token: null,
  loding: false,
  error: null,
  nickname: null
}

export default function authReducer (state = initialState, action) {
  switch (action.type) {
    case LOGIN_START :
      return {
        token: null,
        loading: true,
        error: null,
        nickname: null,
      }
    case LOGIN_SUCCESS :
      return {
        token: action.token,
        loading: true,
        error: null,
        nickname: action.nickname,
      }
    case LOGIN_FAIL :
      return {
        token: null,
        loading: false,
        error: action.error,
        nickname: null,
      }
    case LOGOUT :
      return {
        token: null,
        loading: false,
        error: null,
        nickname: null,
      }
    default:
      return state;
  }
}
// thunk

export const loginThunk = (email, password, history) => {
  return async (dispatch) => {
    try {
      dispatch(loginStart());
      const token = await SigninService.login(email, password);
      const nickName = email.split('@')[0];
      TokenService.save(token, nickName);
      dispatch(loginSuccess(token, nickName))
      history.push('/')
    } catch (error) {
      dispatch(loginFail(error))
    }
  }

}

export const logoutThunk = (history) => {
  return async (dispatch) => {
    try{
      const token = TokenService.tokenGet()
      SigninService.logout(token)
      TokenService.remove();
      dispatch(logout());
      history.push('/signin')
    } catch (error) {
      console.log(error)
    }
  }
}

// export default loginThunk;