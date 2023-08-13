import React, { useEffect, useState } from 'react';
import {  useNavigate } from "react-router-dom";
import axios from 'axios';
import { SocketbackendUrl, backendUrl } from '../helper/Api';
import DatePicker from "react-datepicker";
import {io} from "socket.io-client"

import "react-datepicker/dist/react-datepicker.css";

export default function TaskList() {

    const navigate = useNavigate();

    const [socket, setSocket] = useState(null);
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
        getTasks();
        // socket connection
        setSocket(io(SocketbackendUrl));
    }, []);

    useEffect(() => {
        if(socket){
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

    const deleteTask = (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            if (id) {
                axios.delete(backendUrl + '/delete/' + id)
                  .then(function (response) {
                    getTasks();
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                
            }

            socket.emit('delete',{message: "delete task from client"});
        }
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

    const save = (e) => {
        e.preventDefault();
        // console.log(date, title, desc, status);
        //check error and display error message
        if (title == "" || desc == "" || status == '' || date == '') {
            
            if (title == ""){
                setErrTitle("The field is required");
            }
            if (desc == ""){
                setErrDesc("The field is required");
            }
            if (status == ""){
                setErrStatus("The field is required");
            }
            if (date == ""){
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
                console.log(error?.response?.data?.errors?.due_date[0]);
                setErrTitle(error?.response?.data?.errors?.title && error?.response?.data?.errors?.title[0]);
                setErrDesc(error?.response?.data?.errors?.description && error?.response?.data?.errors?.description[0]);
                setErrStatus(error?.response?.data?.errors?.status && error?.response?.data?.errors?.status[0]);
                setErrDate(error?.response?.data?.errors?.due_date && error?.response?.data?.errors?.due_date[0]);
              
              });
              socket.emit('create',{message: "create task  from client"});
        }else{
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
                setErrTitle(error?.response?.data?.errors?.title && error?.response?.data?.errors?.title[0]);
                setErrDesc(error?.response?.data?.errors?.description && error?.response?.data?.errors?.description[0]);
                setErrStatus(error?.response?.data?.errors?.status && error?.response?.data?.errors?.status[0]);
                setErrDate(error?.response?.data?.errors?.due_date && error?.response?.data?.errors?.due_date[0]);
              });
              socket.emit('update',{message: "update task  from client"});

        }
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

    const cancel = (e) => {
        // cancel the task and reset the form
        e.preventDefault();
        resetForm();
    }

    const viewTask = (id) => {
        tasks.map((task) => {
            if (task.id == id) {
              sessionStorage.setItem('task', JSON.stringify(task))
            }
        })
        navigate('/task-view/'+id)
    }

    return (
        <>
            <header>
                <h1>Task List</h1>
            </header>
            <div className="container">
                <div className="row m-5">
                {/* Task form */}
                    <div className="col-md-6">
                        <form action="" className='task-form-bg p-5'>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Title</label>
                                <input required type="text" className="form-control" placeholder="Title..." onChange={e => setTitle(e.target.value)} value={title} />
                                <span className='text-danger'>{errtitle}</span>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="exampleFormControlTextarea1" className="form-label">Description</label>
                                <textarea required className="form-control" rows="3" onChange={e => setDesc(e.target.value)} placeholder="Description..." value={desc}></textarea>
                                <span className='text-danger'>{errdesc}</span>
                            </div>
                            <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Status</label>
                                <select required className="form-select" onChange={e => setStatus(e.target.value)}>
                                <option value="">select</option>
                                    <option selected={status == 'todo' ? 'selected' : ''} value="todo">Todo</option>
                                    <option selected={status == 'in_progress' ? 'selected' : ''} value="in_progress">In progress</option>
                                    <option selected={status == 'completed' ? 'selected' : ''} value="completed">Completed</option>
                                </select>
                                <span className='text-danger'>{errstatus}</span>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Date</label>
                                <DatePicker selected={date} className="form-control" onChange={(date) => setDate(date)} />
                                <span className='text-danger'>{errdate}</span>
                            </div>
                            <button  onClick={cancel} className="btn btn-success me-2">Cancel</button>
                            <button type="submit" onClick={save} className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                {/* Task list */}
                    <div className="col-md-6">
                        <table className="table table-hover table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Titles</th>
                                    <th scope="col">Due dates</th>
                                    <th scope="col">EditTask</th>
                                    <th scope="col">View</th>
                                    <th scope="col">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tasks.map((task, i) => (
                                        <tr key={task.id}>
                                            <th scope="row">{i + 1}</th>
                                            <td>{task?.title}</td>
                                            <td>{task?.due_date}</td>

                                            <td className="text-center">
                                                <a onClick={() => editTask(task?.id)} className="btn btn-outline-success py-0">Edit</a>
                                            </td>
                                            <td className="text-center">
                                                <a onClick={() => viewTask(task?.id)} className="btn btn-outline-primary py-0">view</a>
                                            </td>
                                            <td>
                                                <a onClick={() => deleteTask(task?.id)}
                                                    className="btn btn-outline-danger py-0">Delete</a>
                                            </td>

                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
