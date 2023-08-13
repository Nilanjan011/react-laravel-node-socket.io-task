import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function TaskView() {
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        if (sessionStorage.getItem('task')) {
    
            const task = JSON.parse(sessionStorage.getItem('task'));
            setTitle(task?.title);
            setDesc(task?.description);
            setStatus(task?.status);
            setDate(task?.due_date);
            sessionStorage.removeItem('task');
        }
    }, []);
    return (
        <>
            <header>
                <h1>Task View</h1>
            </header>
            <div className="task-container">
                <div className='d-flex justify-content-between'>
                <h2 className="task-title">{title}</h2>
                <div >
                    <h6>Date: {date}</h6>
                    <h6>Status: {status}</h6>
                </div>

                </div>
                <p className="task-details">{desc}</p>
                <div className="task-actions">
                    <button onClick={()=>navigate('/')} className="action-button">Back</button>
                </div>
            </div>
        </>
    )
}
