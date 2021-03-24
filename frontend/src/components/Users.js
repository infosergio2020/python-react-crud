import React,{useState,useEffect}  from "react";
// useEffect nos permite despues volver a ejecutar codigo despues del renderizado del componente
const API = process.env.REACT_APP_API;

export const Users = () => {

    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [users,setUsers] = useState([])

    const [editing,setEditing] = useState(false)
    const [id,setId] = useState('')

    const handleSubmit = async (e) =>{
        e.preventDefault();

        if(!editing){            
            console.log(name,email,password); //con esto vemos los estados 
            const res = await fetch(`${API}/users`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })
            const data = await res.json();
            console.log(data);
        }
        else{
            const res = await fetch(`${API}/users/${id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })
            const data = await res.json();
            console.log(data);
        }

        //debo obtener a los usuarios y limpiar el formulario
        await getUsers();

        setName('')
        setEmail('')
        setPassword('')

    }


    const getUsers = async ()=>{
        const res = await fetch(`${API}/users`)
        const data = await res.json();
        // data es una lista de usuarios
        setUsers(data)
    }

    useEffect(()=>{
        getUsers();
    },[])

    const editUser = async (id) => {
        const res = await fetch(`${API}/users/${id}`)
        const data = await res.json(); 
        
        setEditing(true);
        setId(id);

        setName(data.name)
        setEmail(data.email)
        setPassword(data.password)
    }

    const deleteUser = async (id)=>{
        // antes de ejecutar la secuencia voy a pedir confirmacion del usuario
        const userResponse = window.confirm('Are you sure wat to dlete it?')
        if(userResponse){
            const res = await fetch(`${API}/users/${id}`,{
                method:'DELETE'
            })
            const data = await res.json();
            console.log(data);
            await getUsers();
        }
    }

    return(
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body">
                    <div className="form-group">
                        <input type="text" 
                        onChange={e => setName(e.target.value)} 
                        value={name}
                        className="form-control"
                        placeholder="Name"
                        autoFocus
                         />
                    </div>                


                    <div className="form-group">
                        <input type="email" 
                        onChange={e => setEmail(e.target.value)} 
                        value={email}
                        className="form-control"
                        placeholder="Email"
                         />
                    </div>                


                    <div className="form-group">
                        <input type="password" 
                        onChange={e => setPassword(e.target.value)} 
                        value={password}
                        className="form-control"
                        placeholder="Password"
                         />
                    </div>
                    <button className="btn btn-primary btn-block">
                        Create
                    </button>
                </form>
            </div>    
            <div className="col-md-6">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th> Name </th>
                            <th> Email </th>
                            <th> Password </th>
                            <th> Operations </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td> {user.name} </td>
                                <td> {user.email} </td>
                                <td> {user.password} </td>
                                <td>
                                    <button 
                                    className="btn btn-secondary btn-sm btn-block"
                                    onClick={(e) => editUser(user._id)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn btn-danger btn-sm btn-block"
                                        onClick={ (e) => deleteUser(user._id)}
                                        >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}