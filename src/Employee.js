import React, { useState, useEffect, useRef } from 'react';

function EmployeeList(props) {
  const [list, setList] = useState([]);
  const [employee, setEmployee] = useState({});
  const [employees, setEmployees] = useState([]);
  const [adding, setAdding] = useState(true);
  const textInput = useRef(null);
  const apiUri = process.env.REACT_APP_API_URI;

  console.log('apiUri', apiUri);

  const fetchEmployee = () => {
    fetch(`${apiUri}employee`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let employees = data.data;
        let L = employees.map((v, i) => {
          return (
            <Employee
              key={v._id}
              onDelete={onDelete}
              onEdit={onEdit}
              data={v}
            />
          );
        });
        setEmployees(employees);
        setList(L);
      });
  };

  useEffect(() => {
    console.log('useEffect');
    fetchEmployee();
  }, []);

  const onDelete = (data) => {
    let deleteEmployee = data;
    fetch(`${apiUri}employee`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(deleteEmployee),
    })
      .then((res) => res.json())
      .then((res) => {
        fetchEmployee();
      });

    setEmployee({});
    setAdding(true);
  };

  const onEdit = (data) => {
    console.log('onEdit', data);
    textInput.current.value = data.name;
    setAdding(false);
    setEmployee(data);
  };

  const updateEmployee = () => {
    let updateEmployee = employee;
    updateEmployee.name = textInput.current.value;
    console.log('UpdateEmployee', updateEmployee);
    fetch(`${apiUri}employee`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(updateEmployee),
    })
      .then((res) => res.json())
      .then((res) => {
        fetchEmployee();
      });

    setEmployee({});
    setAdding(true);
  };

  const addEmployee = () => {
    let newEmployee = textInput.current.value;
    console.log('Add Employee', newEmployee);
    console.log('\t', JSON.stringify({ name: newEmployee }));

    fetch(`${apiUri}employee`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ name: newEmployee }),
    })
      .then((res) => res.json())
      .then((res) => {
        fetchEmployee();
      });
  };

  return (
    <div>
      <ul>{list}</ul>
      New Employee: <input name='employee' ref={textInput} />
      {adding && <button onClick={addEmployee}>Add Employee</button>}
      {!adding && <button onClick={updateEmployee}>Update Employee</button>}
    </div>
  );
}

const Employee = ({ data, onEdit, onDelete }) => (
  <li>
    <button onClick={() => onEdit(data)}>Edit</button>
    <button onClick={() => onDelete(data)}>Delete</button>
    &nbsp;&nbsp;&nbsp;
    {data.name}
  </li>
);
export default EmployeeList;
