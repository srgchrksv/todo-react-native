import React, { useState, useEffect } from 'react';
import { TextInput, Button, View, Text, StyleSheet, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';

export function Form() {
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState('');
    const [countTodos, setCountTodos] = useState(0);
    const [prevCountTodos, setPrevCountTodos] = useState(0);
    const [cards, setCards] = useState<Array<{ id: number, name: string, isChecked: boolean }>>([]);

    const emptyTodoMessage = 'Todo cannot be empty';

    const handleSubmit = () => {
        if (inputValue === "") {
            setMessage(emptyTodoMessage);
            return;
        }
        setMessage('');
        let newCards = { id: cards.length + 1, name: inputValue, isChecked: false };
        setCards([...cards, newCards]);
        setCountTodos(countTodos + 1);
        setInputValue('');
    };

    const handleDelete = (id: number) => {
        setCards(prevCards => {
            return prevCards.filter(card => {
                if (card.id === id && !card.isChecked) {
                    setCountTodos(prevCount => prevCount - 1);
                }
                return card.id !== id;
            });
        });
    };

    const handleChecked = (id: number) => {
        setCards(prevCards => {
            return prevCards.map(card => {
                if (card.id === id) {
                    setCountTodos(prevCount => prevCount + (!card.isChecked ? -1 : 1));
                    return { ...card, isChecked: !card.isChecked };
                }
                return card;
            });
        });
    };

    useEffect(() => {
        if (prevCountTodos === 0 && countTodos > 0) {
            setPrevCountTodos(countTodos);
            setMessage('');
        }
        if (countTodos === 0 && prevCountTodos > 0) {
            setMessage('All TODOs are done');
            setPrevCountTodos(0);
        }
        if (cards.length === 0) {
            setMessage('');
        }
    }, [cards]);

    return (
        <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
                <View style={styles.messageContainer}>
                    {countTodos > 0 && (<Text style={styles.todoCount}>You got {countTodos.toString()} TODOs to be done</Text>)}
                    {message && (<Text style={[styles.message, { color: message === emptyTodoMessage ? 'red' : 'green' }]}>{message}</Text>)}
                </View>
                <TextInput
                    value={inputValue}
                    onChangeText={setInputValue}
                    placeholder="Enter a TODO"
                    style={styles.input}
                />
                <Button title="Submit" onPress={handleSubmit} />
            </View>
            <ScrollView style={styles.cardsContainer}>
                {cards.map(card => (
                    <View key={card.id} style={styles.card}>
                        <Text style={styles.cardText}>{card.name}</Text>
                        <Checkbox
                            value={card.isChecked}
                            onValueChange={() => handleChecked(card.id)}
                            style={styles.checkbox}
                        />
                        <Button title='Delete' onPress={() => handleDelete(card.id)} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        width: '100%',
        padding: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    messageContainer: {
        height: 65,
    },
    todoCount: {
        fontSize: 16,
        marginBottom: 10,
    },
    message: {
        fontSize: 14,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderColor: 'gray',
        borderRadius: 5,
    },
    cardsContainer: {
        flex: 1,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    cardText: {
        flex: 3,
        fontSize: 16,
    },
    checkbox: {
        margin: 9,
        padding: 15,
        width: 24,
        height: 24,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 5,
    },
});