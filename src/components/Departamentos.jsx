import { useEffect, useState } from 'react'
import axios from 'axios';

function Departamentos({data, setData}) {
  const [form, setForm] = useState({
    nome: "",
    localizacao: ""
  });

  const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/departamento");
				setData(res.data.msg)
				console.log(res)
      } catch (erro) {
        console.log(erro);
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/departamento", form);
      console.log("Departamento cadastrado:", res.data);
      
      setForm({
        nome: "",
        localizacao: ""
      });

      fetchData()
    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);
      alert("Erro ao cadastrar departamento");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar este departamento?")) return;

    try {
      await axios.delete(`http://localhost:3000/departamento`, {
        data: { id_departamento: id }
      });
      fetchData();
    } catch (erro) {
      if (erro.response.status === 404) {
        alert("Erro 404: Departamento não encontrado.");
        fetchData();
      } 
      console.error("Erro ao deletar:", erro);
      alert("Erro ao deletar");
    }
  };

	useEffect( () => {
    fetchData();
	}, [])

  return (
    <>
      <h2>Departamentos</h2>

			<div>
				<h3>Criar departamento</h3>
        <form onSubmit={handleSubmit}>
          <input
            required
            placeholder="Nome"
            name="nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <input
            required
            placeholder="Localização"
            name="localizacao"
            value={form.localizacao}
            onChange={(e) => setForm({ ...form, localizacao: e.target.value })}
          />
          <button>Enviar</button>
        </form>   
			</div>

      <table>
			<thead>
				<tr>
          <th>ID Departamento</th>
          <th>Nome</th>
          <th>Localização</th>
          <th>Ações</th>
        </tr>
			</thead>
      <tbody>
				{data ? data.map((item) => (
					<tr key={item.id_departamento}>
						<td>{item.id_departamento}</td>
						<td>{item.nome}</td>
						<td>{item.localizacao}</td><td>
              <button onClick={() => handleDelete(item.id_departamento)}>
                Deletar
              </button>
            </td>
        	</tr>
				)) : <></>}
      </tbody>
    </table>
    </>
  )
}

export default Departamentos
