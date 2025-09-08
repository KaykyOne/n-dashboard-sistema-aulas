import Modal from '@/components/Modal';
import React, { useState, useEffect } from 'react';
import { getDay, format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [text, setText] = useState('');
    const [repeatDays, setRepeatDays] = useState([]);
    const [open, setOpen] = useState(false);
    const [tasksHoje, setTasksHojes] = useState([]);

    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

    // Carrega tasks do localStorage
    useEffect(() => {
        const saved = localStorage.getItem('tasks');
        if (saved) setTasks(JSON.parse(saved));
    }, []);

    // Salva tasks no localStorage
    useEffect(() => {
        let taskhj = [];
        const today = getDay(new Date());
        tasks.forEach(task => {
            task.repeatDays.forEach(element => {
                if (element === today) taskhj.push(task);
            });
        });
        setTasksHojes(taskhj);
        setOpen(taskhj.length > 0);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);


    const addTask = () => {
        if (!text) return;
        setTasks([...tasks, { id: Date.now(), text, repeatDays }]);
        setText('');
        setRepeatDays([]);
    };

    const toggleDay = (day) => {
        setRepeatDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <div className="p-6 card anim-hove">
            <h2 className="text-2xl font-bold mb-4 text-center">Task Manager</h2>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Nova task"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="flex-1 p-2 border rounded"
                />
                <Button onClick={addTask}>
                    Adicionar
                    <span className="material-icons">
                        add
                    </span>
                </Button>
            </div>

            <div className="mb-4">
                <span className="font-semibold mr-2">Repetir nos dias:</span>
                {daysOfWeek.map((day, index) => (
                    <label key={day} className="inline-flex items-center mr-2">
                        <input
                            type="checkbox"
                            checked={repeatDays.includes(index)}
                            onChange={() => toggleDay(index)}
                            className="mr-1"
                        />
                        {day}
                    </label>
                ))}
            </div>

            <ul>
                {tasks.map(task => (
                    <li
                        key={task.id}
                        className="flex justify-between items-center p-2 bg-white rounded shadow mb-2"
                    >
                        <div>
                            <span className="font-medium">{task.text}</span>
                            {task.repeatDays.length > 0 && (
                                <span className="text-sm text-gray-500 ml-2">
                                    (Repetir: {task.repeatDays.map(item => `${daysOfWeek[item]}, `)})
                                </span>
                            )}
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                            <button
                                className='bg-green-800 text-white p-2 pl-4 pr-4 rounded-md'
                                onClick={() => deleteTask(task.id)} >
                                Concluir
                            </button>
                            <button
                                className='bg-red-800 text-white p-2 pl-4 pr-4 rounded-md'
                                onClick={() => deleteTask(task.id)} >
                                Excluir
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {open && (
                <Modal onClose={() => setOpen(false)}>
                    <h1 className="text-2xl font-bold mb-4 text-center text-primary">
                        Tarefas para hoje
                    </h1>

                    {/* Lista de tasks */}
                    <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
                        {tasksHoje.map((item, index) => (
                            <div
                                key={index}
                                className="bg-blue-50 border-l-4 border-amber-400 p-3 rounded shadow-sm hover:shadow-md transition-shadow"
                            >
                                <span className="font-medium text-gray-800">{item.text}</span>
                            </div>
                        ))}
                        {tasksHoje.length === 0 && (
                            <p className="text-gray-500 text-center">Nenhuma tarefa para hoje 🎉</p>
                        )}
                    </div>
                </Modal>

            )}
        </div>
    );
}
