import React, { createContext, useState, useEffect, ReactNode, FC } from 'react';

type MonitorContextType = {
    messages: string[];
    addMessage: (message: string) => void;
}

export const MonitorContext = createContext<MonitorContextType | undefined>(undefined);

type MonitorProviderProps = {
    children: ReactNode;
}

export const MonitorProvider: FC<MonitorProviderProps> = ({ children }) => {

    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        setMessages(['Monitor started']);
    },
        []);

    const addMessage = (message: string) => {
        console.log('Monitor: ' + message);
        setMessages(prevMessages => {
            const newMessages = [...prevMessages, message];
            if (newMessages.length > 25) {
                newMessages.shift();
            }
            return newMessages;
        });
    };

    return (
        <MonitorContext.Provider value={{ addMessage, messages }}>
            {children}
        </MonitorContext.Provider>
    );
};

