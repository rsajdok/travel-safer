import React, { createContext, useState, useEffect, ReactNode, FC } from 'react';

type TimerContextType = {
    timeLeft: number;
    timerRunning: boolean;
    startTimer: () => void;
    stopTimer: () => void;
}

export const TimerContext = createContext<TimerContextType | undefined>(undefined);

type TimerProviderProps = {
    children: ReactNode;
}

export const TimerProvider: FC<TimerProviderProps> = ({ children }) => {

    const timeToWait = 300; // 5 minutes in seconds

    const [timeLeft, setTimeLeft] = useState(timeToWait);
    const [timerRunning, setTimerRunning] = useState(false);

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (timerRunning) {
            timer = setInterval(() => {
                console.log('Timer running: ' + timeLeft);
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        }
        if (timeLeft === 0) {
            clearInterval(timer);
            console.log('Timer expired');
            setTimerRunning(false);
        }
        return () => clearInterval(timer);
    },
        [timerRunning, timeLeft]);

    const startTimer = () => {
        console.log('Start timer');
        setTimeLeft(timeToWait);
        setTimerRunning(true);
    };

    const stopTimer = () => {
        console.log('Stop timer');
        setTimerRunning(false);
    };


    return (
        <TimerContext.Provider value={{ timeLeft, startTimer, stopTimer, timerRunning }}>
            {children}
        </TimerContext.Provider>
    );
};

