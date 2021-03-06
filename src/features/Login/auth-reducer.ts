import {Dispatch} from 'redux'
import {
    SetAppErrorActionType,
    setAppStatus,
    SetAppStatusActionType, setInitializedAC,
    setInitializedActionType
} from "../../state/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {authAPI, LoginParamsType} from "../../api/login-api";


const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}


// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatus('loading'))
    authAPI.login(data)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus("succeeded"))
                dispatch(setIsLoggedInAC(true))
            } else {
                console.log(res.data)
                handleServerAppError(dispatch, res.data)
            }

        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error)
        })

}

export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatus("loading"))
    authAPI.me()
        .then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus("succeeded"))
            dispatch(setIsLoggedInAC(true));
        } else {
            handleServerAppError(dispatch, res.data)
        }

    })
        .catch((error) => {
            dispatch(setAppStatus("failed"))
            handleServerNetworkError(dispatch, error)

        })
        .finally(()=>{
            dispatch(setInitializedAC(true))
        })
}

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatus("loading"))
    authAPI.logout()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus("succeeded"))
                dispatch(setIsLoggedInAC(false));
            } else {
                handleServerAppError(dispatch, res.data)
            }

        })
        .catch((error) => {
            dispatch(setAppStatus("failed"))
            handleServerNetworkError(dispatch, error)

        })
        .finally(()=>{
            dispatch(setInitializedAC(true))
        })
}


// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)
// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusActionType | SetAppErrorActionType | setInitializedActionType
