import { useEffect, useState } from "react";
import { SocketbackendUrl, backendUrl } from '../helper/Api';
import { useNavigate } from "react-router-dom";

import axios from 'axios';

export default function TaskAPI() {
    const navigate = useNavigate();

    const [socket, setSocket] = useState();
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');
    const [id, setId] = useState(null);

    const [errtitle, setErrTitle] = useState('');
    const [errdesc, setErrDesc] = useState('');
    const [errstatus, setErrStatus] = useState('');
    const [errdate, setErrDate] = useState('');

    useEffect(() => {
        if (socket) {
            socket.on("delete-server", (data) => {
                console.log(data);
            });
            socket.on("create-server", (data) => {
                console.log(data);
            });

            socket.on("update-server", (data) => {
                console.log(data);
            });
        }
    }, [socket]);

    const getTasks = () => {
        axios.get(backendUrl + '/tasks')
            .then((response) => {
                if (response.status == 200) {
                    setTasks(response?.data?.data?.tasks);
                }
            })
            .catch((err) => console.log(err))

    }

    const deleteAction = (id) => {
        axios.delete(backendUrl + '/delete/' + id)
            .then(function (response) {
                getTasks();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const save = (e) => {
        e.preventDefault();

        if (title == "" || desc == "" || status == '' || date == '') {

            if (title == "") {
                setErrTitle("The field is required");
            }
            if (desc == "") {
                setErrDesc("The field is required");
            }
            if (status == "") {
                setErrStatus("The field is required");
            }
            if (date == "") {
                setErrDate("The field is required");
            }

            return false;
        }
        if (id == null) {
            // if id is null  mean task is created
            axios.post(backendUrl + '/add-task', {
                title: title,
                description: desc,
                status: status,
                due_date: date,
            })
                .then(function (response) {
                    getTasks();
                    resetForm();
                })
                .catch(function (error) {
                    // display error message
                    displayError(error);
                });
            socket.emit('create', { message: "create task  from client" });
        } else {
            // if id is not null mean task is updated
            axios.put(backendUrl + '/add-task/', {
                title: title,
                description: desc,
                status: status,
                due_date: date,
                id: id
            })
                .then(function (response) {
                    getTasks();
                    resetForm();

                })
                .catch(function (error) {
                    // display error message
                    displayError(error);
                });
            socket.emit('update', { message: "update task  from client" });

        }
    }

    const displayError = (error) => {
        setErrTitle(error?.response?.data?.errors?.title && error?.response?.data?.errors?.title[0]);
        setErrDesc(error?.response?.data?.errors?.description && error?.response?.data?.errors?.description[0]);
        setErrStatus(error?.response?.data?.errors?.status && error?.response?.data?.errors?.status[0]);
        setErrDate(error?.response?.data?.errors?.due_date && error?.response?.data?.errors?.due_date[0]);
    }

    const resetForm = () => {
        setId(null)
        setTitle('')
        setStatus('')
        setDate('')
        setDesc('')
        setErrTitle('')
        setErrDesc('')
        setErrStatus('')
        setErrDate('')
    }

    const editTask = (id) => {
        tasks.map((task) => {
            if (task.id == id) {
                setId(task.id);
                let date = new Date(task.due_date)
                setDate(date)
                setDesc(task.description)
                setStatus(task.status)
                setTitle(task.title)
            }
        })
    }

    const viewTask = (id) => {
        tasks.map((task) => {
            if (task.id == id) {
                sessionStorage.setItem('task', JSON.stringify(task))
            }
        })
        navigate('/task-view/' + id)
    }


    return {
        tasks,
        getTasks,
        deleteAction,
        save,
        viewTask,
        title,
        desc,
        status,
        date,
        resetForm,
        editTask,
        setTitle,
        setStatus,
        setDate,
        setDesc,
        errtitle,
        errdesc,
        errstatus,
        errdate,
        socket, setSocket
    }
}