// import './App.css';
import { Route, Routes } from "react-router-dom"
import TaskList from './task/TaskList';
import TaskView from './task/TaskView';
function App() {
  return (
    <Routes>
      <Route path="/" element={<TaskList />} />
      <Route path="/task-view/:id" element={<TaskView />} />
    </Routes>
  );
}

export default App;
