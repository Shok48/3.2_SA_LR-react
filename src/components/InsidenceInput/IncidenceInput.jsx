import { Space, Button, Select, Modal } from 'antd';
import { PlusOutlined, MinusOutlined, DeleteOutlined, ClearOutlined } from '@ant-design/icons';
import styles from './IncidenceInput.module.css'
import { useState, memo, useMemo, useCallback } from 'react';

const InputSelector = memo(({ fieldId, inputId, value, fieldsKeys, onRemove, onChange }) => {
    const handleChange = useCallback((value) => {
        onChange(fieldId, inputId, value);
    }, [onChange, fieldId, inputId]);

    return (
        <Space>
            <Select
                value={value}
                onChange={handleChange}
                style={{ width: 80 }}
            >
                {fieldsKeys.map((key) => (
                    <Select.Option key={key} value={key}>{key}</Select.Option>
                ))}
            </Select>
            <Button
                className={styles.removeButton}
                icon={<MinusOutlined />}
                onClick={onRemove}
                size="small"
                danger
            />
        </Space>
    );
});

const FieldManager = memo(({ fieldId, inputs, onAddInput, allFields, onRemoveField, onRemoveInput, onInputChange }) => {    
    return (
        <Space className={styles.fieldContainer}>
            <span>{fieldId}: &#123;</span>
            {
                inputs.map((input, index) => (
                    <InputSelector 
                        key={`${fieldId}-${index}`} 
                        fieldId={fieldId}
                        inputId={index}
                        value={input}
                        fieldsKeys={Object.keys(allFields)}
                        onRemove={() => onRemoveInput(fieldId, index)}
                        onChange={onInputChange}
                    />
                ))
            }
            <Button
                className={styles.addButton}
                icon={<PlusOutlined />}
                onClick={() => onAddInput(fieldId)}
                type="primary"
                size="small"
            />
            <span>&#125;</span>
            <Button
                className={styles.removeButton}
                icon={<DeleteOutlined />}
                onClick={() => onRemoveField(fieldId)}
                size="small"
                danger
            />
        </Space>
    )
})

const IncidenceInput = () => {
    const [fields, setFields] = useState( { 1: [2, 3], 2: [1], 3: [] } );

    const addField = useCallback(() => {
        const newFieldId = Object.keys(fields).length + 1;
        setFields((prevFields) => ({
            ...prevFields,
            [newFieldId]: []
        }));
    }, [fields])

    const addInput = useCallback((fieldId) => {
        setFields((prevFields) => ({
            ...prevFields,
            [fieldId]: [...prevFields[fieldId], Object.keys(fields)[0]]
        }));
    }, [fields])

    const removeField = useCallback((fieldId) => {
        setFields((prevFields) => {
            const { [fieldId]: _, ...restFields } = prevFields;
            return Object.entries(restFields).reduce((acc, [, value], index) => {
                acc[index + 1] = value;
                return acc;
            }, {});
        });
    }, [])

    const removeInput = useCallback((fieldId, inputId) => {
        setFields((prevFields) => ({
            ...prevFields,
            [fieldId]: prevFields[fieldId].filter((_, id) => id !== inputId)
        }));
    }, []);

    const clearFields = useCallback(() => {
        setFields({ 1: [] })
    }, []);

    const changeInput = useCallback((fieldId, inputId, value) => {
        setFields((prevFields) => ({
            ...prevFields,
            [fieldId]: prevFields[fieldId].map((item, id) =>
                id === inputId ? value : item
            )
        }));
    }, []);

    const fieldEntries = useMemo(() => Object.entries(fields), [fields]);
    
    return (
        <div className={styles.container}>
            <h3>Введите инциденции</h3>
            <div className={styles.inputContainer}>
                {
                    fieldEntries.map(([fieldId, inputs]) => (
                        <FieldManager 
                            key={fieldId} 
                            fieldId={fieldId} 
                            inputs={inputs}
                            onRemoveField={removeField}
                            onAddInput={addInput}
                            onRemoveInput={removeInput}
                            onInputChange={changeInput}
                            allFields={fields}
                        />
                    ))
                }
            </div>
            <Space className={styles.actionContainer}>
                <Button type="primary" icon={<PlusOutlined />} onClick={addField}>Добавить поле</Button>
                <Button type="primary" icon={<ClearOutlined />} onClick={clearFields}>Очистить</Button>
            </Space>
        </div>
    )
}

export default IncidenceInput;
