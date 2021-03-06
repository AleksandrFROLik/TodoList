import React, {useCallback, useEffect} from 'react';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {AddItemForm} from "../../components/addItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {
    createTaskTC,
    deleteTaskTC,
    TasksStateType,
    upDateTaskStatusTC,
    upDateTaskTitleTC
} from "./tasks-reducer";

import {TaskStatuses} from "../../api/tasks-api";
import {
    changeTodolistFilterAC, createTodoListTC,
    deleteTodoListTC,
    FilterValuesType,
    getTodoListsTC,
    TodolistDomainType,
    upDateTodoListTC
} from "./todolists-reducer";
import {useDispatch} from "react-redux";
import {useAppSelector,} from "../../state/store";
import {Navigate} from "react-router-dom";


export const TodolistLists = React.memo(() => {
    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)
    const isLoggedIn = useAppSelector<boolean>(state => state.login.isLoggedIn)
    const dispatch = useDispatch();

    useEffect(() => {
        if (isLoggedIn) {
             dispatch(getTodoListsTC())
        }
    }, [])


    const removeTask = useCallback(function (params: { taskId: string, todolistId: string }) {
        dispatch(deleteTaskTC(params))
    }, [dispatch]);

    const addTask = useCallback(function (params: { title: string, todolistId: string }) {
        dispatch(createTaskTC(params))
    }, [dispatch]);

    const changeStatus = useCallback(function (params: { taskId: string, status: TaskStatuses, todolistId: string }) {
        dispatch(upDateTaskStatusTC(params))
    }, [dispatch]);

    const changeTaskTitle = useCallback(function (params: { taskId: string, newTitle: string, todolistId: string }) {
        dispatch(upDateTaskTitleTC(params))
    }, [dispatch]);

    const changeFilter = useCallback(function (params: { filter: FilterValuesType, todolistId: string }) {
        dispatch(changeTodolistFilterAC(params))
    }, [dispatch]);

    const removeTodolist = useCallback(function (id: string) {
        dispatch(deleteTodoListTC(id))
    }, [dispatch]);

    const changeTodolistTitle = useCallback(function (params: { todolistId: string, newTitle: string }) {
        debugger
        dispatch(upDateTodoListTC(params))
    }, [dispatch]);

    const addTodolist = useCallback((title: string) => {
        dispatch(createTodoListTC(title))
    }, [dispatch]);


    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }
    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id];
                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                id={tl.id}
                                title={tl.title}
                                filter={tl.filter}
                                entityStatus={tl.entityStatus}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
});

