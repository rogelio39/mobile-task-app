import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

const ModernCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Calendario Moderno</Text>
            <View style={styles.calendarWrapper}>
                <Calendar
                    onDayPress={onDayPress}
                    markedDates={
                        selectedDate
                            ? {
                                [selectedDate]: {
                                    selected: true,
                                    marked: true,
                                    selectedColor: '#4caf50',
                                },
                            }
                            : {}
                    }
                    theme={{
                        todayTextColor: '#ff5722',
                        arrowColor: '#4caf50',
                        textDayFontSize: 16,
                        textMonthFontSize: 18,
                        textDayHeaderFontSize: 14,
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#6d6d6d',
                        selectedDayBackgroundColor: '#4caf50',
                        selectedDayTextColor: '#ffffff',
                        textDisabledColor: '#d9e1e8',
                    }}
                />
            </View>
            {selectedDate && (
                <View style={styles.dateInfo}>
                    <Text style={styles.dateText}>
                        Fecha seleccionada: {selectedDate}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    title: {
        fontSize: 26,
        marginBottom: 20,
        color: '#333',
        fontWeight: 'bold',
    },
    calendarWrapper: {
        borderRadius: 15,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        padding: 10,
    },
    dateInfo: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#e3fcef',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    dateText: {
        fontSize: 18,
        color: '#4caf50',
        fontWeight: '600',
    },
});

export default ModernCalendar;
