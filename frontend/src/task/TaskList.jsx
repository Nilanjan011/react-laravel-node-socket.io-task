import React, { useEffect } from 'react';
import { SocketbackendUrl, backendUrl } from '../helper/Api';
import DatePicker from "react-datepicker";
import {io} from "socket.io-client"

import "react-datepicker/dist/react-datepicker.css";
import taskAPI from '../action/TaskAPI';

export default function TaskList() {

    const { 
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
    } = taskAPI();

    useEffect(() => {
        getTasks();
        // socket connection
        setSocket(io(SocketbackendUrl));
    }, []);

    const deleteTask = (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            if (id) {
                deleteAction(id);
                socket.emit('delete',{message: "delete task from client"});
            }

        }
    }

    const cancel = (e) => {
        // cancel the task and reset the form
        e.preventDefault();
        resetForm();
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
