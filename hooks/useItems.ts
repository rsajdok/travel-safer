import { useState } from 'react';

const useItems = () => {
    const [items, setItems] = useState<String[]>([]);

    const addItem = (item: string) => {
        setItems(prevItems => {
            const newItems = [...prevItems, item];
            if (newItems.length > 10) {
                newItems.shift(); // Remove the first item if there are more than 10
            }
            return newItems;
        });
    };

    return [items, addItem];
};

export default useItems;
