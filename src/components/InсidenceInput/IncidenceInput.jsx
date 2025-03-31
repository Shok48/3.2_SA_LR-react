import { Space, Button, Select, Upload, Modal, message } from 'antd';
import { PlusOutlined, MinusOutlined, DeleteOutlined, ClearOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './IncidenceInput.module.css'
import { memo, useState, useMemo, useCallback, useEffect } from 'react';

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
    const handleRemoveField = useCallback(() => {
        Modal.confirm({
            title: 'Удаление поля',
            content: 'Вы уверены что хотите удалить поле?',
            onOk: () => {
                onRemoveField(fieldId);
                message.success('Поле удалено');
            },
            okText: 'Удалить',
            okButtonProps: {
                danger: true,
            },
            cancelText: 'Отменить',
        });

    }, [onRemoveField, fieldId]);
    

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
                onClick={handleRemoveField}
                size="small"
                danger
            />
        </Space>
    )
})

const IncidenceInput = ({ onDataChange}) => {
    const [fields, setFields] = useState( { 1: [2, 3], 2: [1], 3: [] } );

    useEffect(() => {
        onDataChange?.(fields);
    }, [fields, onDataChange]);

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

    const saveData = useCallback(() => {
        if (Object.keys(fields).length === 0) {
            message.error('Необходимо ввести данные');
            return;
        }

        const blob = new Blob([JSON.stringify(fields, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'incidence.json';
        link.click();

        URL.revokeObjectURL(url);
    }, [fields]);

    const handleUpload = useCallback((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                setFields(data);
                message.success('Данные успешно загружены');
            } catch (error) {
                console.error('Некорректный формат файла', error);
                message.error('Некорректный формат файла');
            }
        }

        reader.readAsText(file);
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
                <Button className={styles.actionButton} type="primary" icon={<PlusOutlined />} onClick={addField}>Добавить поле</Button>
                <Button className={styles.actionButton} type="primary" icon={<ClearOutlined />} onClick={clearFields}>Очистить</Button>
            </Space>
            <Space className={styles.actionContainer}>
                <Button className={styles.actionButton} type="primary" icon={<SaveOutlined />} onClick={saveData}>Сохранить</Button>
                <Upload
                    accept=".json"
                    showUploadList={false}
                    beforeUpload={handleUpload}
                >
                    <Button className={styles.actionButton} type="primary" icon={<UploadOutlined />}>Загрузить</Button>
                </Upload>
            </Space>
        </div>
    )
}

export default IncidenceInput;
