import { createContext, useContext, useState } from 'react';

const CoordinationContext = createContext();

export function CoordinationProvider({ children }) {
    const [threads, setThreads] = useState([
        { id: 1, title: 'Payroll Query regarding August Bonus', dept: 'hr', status: 'Active', time: '10:42 AM', preview: 'Could you clarify the tax deduction on...' },
        { id: 2, title: 'Sales enablement material request', dept: 'sales', status: 'Pending', time: 'Yesterday', preview: 'I need the new Q4 slide decks.' },
        { id: 3, title: 'IT Support: VPN Access Issue', dept: 'support', status: 'Closed', time: 'Sep 12', preview: 'Your ticket has been resolved successfully.' },
    ]);

    const addThread = (dept, title, preview) => {
        const newThread = {
            id: Date.now(),
            title,
            dept: dept.toLowerCase(),
            status: 'Active',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            preview
        };
        setThreads(prev => [newThread, ...prev]);
    };

    return (
        <CoordinationContext.Provider value={{ threads, addThread, setThreads }}>
            {children}
        </CoordinationContext.Provider>
    );
}

export function useCoordination() {
    return useContext(CoordinationContext);
}
