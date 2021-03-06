import axios, {AxiosResponse} from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        "API-KEY": 'a91e2a50-b598-40d2-8669-617f8002697a'
    }
})

type Created = ResponseType<{item: TodoType}>

export const todolistsApi = {
    getTodoLists() {
        return instance.get<TodoType[]>('/todo-lists')
    },

    createTodoList(title: string) {
        return instance.post<Created, AxiosResponse<Created>, {title: string}>(`/todo-lists`, {title})
    },

    deleteTodoList(todolistId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}`)
    },

    upDateTodoList(params:{newTitle: string, todolistId: string}) {
        return instance.put<Created, AxiosResponse<Created>, {title: string}>(`/todo-lists/${params.todolistId}`, {title: params.newTitle})
    }
}


export type TodoType = {
    id: string,
    title: string,
    addedDate: string,
    order: string
}

export type ResponseType<T = {}> = {
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
    data: T
}

