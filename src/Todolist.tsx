import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from './AddItemForm'
import {EditableSpan} from './EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from './Task'
import {FilterValuesType} from './App';
import {useDispatch} from "react-redux";
import {getTasksTC} from "./state/tasks-reducer";
import {TaskStatuses, TaskType} from "./api/tasks-api";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    changeFilter: (params: { filter: FilterValuesType, todolistId: string }) => void
    addTask: (params:{title: string, todolistId: string}) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (params:{taskId: string, todolistId: string}) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (params: { todolistId: string, newTitle: string }) => void
    filter: FilterValuesType

}

export const Todolist = React.memo(function (props: PropsType) {
    console.log('Todolist called')

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getTasksTC(props.id))
    }, [])


    const addTask = useCallback((title: string) => {
        props.addTask({title, todolistId:props.id})
    }, [props.addTask, props.id])

    const removeTodolist = () => {
        props.removeTodolist(props.id)
    }
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle({todolistId: props.id, newTitle: title})
    }, [props.id, props.changeTodolistTitle])

    const onAllClickHandler = useCallback(() => props.changeFilter({
        filter: 'all',
        todolistId: props.id
    }), [props.id, props.changeFilter])
    const onActiveClickHandler = useCallback(() => props.changeFilter({
        filter: 'active',
        todolistId: props.id
    }), [props.id, props.changeFilter])
    const onCompletedClickHandler = useCallback(() => props.changeFilter({
        filter: 'completed',
        todolistId: props.id
    }), [props.id, props.changeFilter])


    let tasksForTodolist = props.tasks

    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.id}
                                                removeTask={props.removeTask}
                                                changeTaskTitle={props.changeTaskTitle}
                                                changeTaskStatus={props.changeTaskStatus}
                />)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


