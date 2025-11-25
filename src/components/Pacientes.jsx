import { useEffect, useState } from 'react'
import axios from 'axios';

function Pacientes({data, setData}) {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    data_nascimento: "",
    endereco: ""
  });

  const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/paciente");
				setData(res.data.msg)
				console.log(res)
      } catch (erro) {
        console.log(erro);
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/paciente", form);
      console.log("Paciente cadastrado:", res.data);
      
      setForm({
        nome: "",
        cpf: "",
        data_nascimento: "",
        endereco: ""
      });

      fetchData()
    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);
      alert("Erro ao cadastrar paciente");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar este paciente?")) return;

    try {
      await axios.delete(`http://localhost:3000/paciente`, {
        data: { id_paciente: id }
      });
      fetchData();
    } catch (erro) {
      if (erro.response.status === 404) {
        alert("Erro 404: Paciente não encontrado.");
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
      <h2>Paciente</h2>

			<div>
				<h3>Criar paciente</h3>

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
            placeholder="CPF"
            name="cpf"
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
          />

          <input
            required
            type="date"
            name="data_nascimento"
            value={form.data_nascimento}
            onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })}
          />

          <input
            required
            placeholder="Endereço"
            name="endereco"
            value={form.endereco}
            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          />

          <button>Enviar</button>
        </form>   
			</div>

      <table>
			<thead>
				<tr>
          <th>ID Paciente</th>
          <th>Nome</th>
          <th>CPF</th>
          <th>Data Nascimento</th>
          <th>Endereco</th>
          <th>Ações</th>
        </tr>
			</thead>
      <tbody>
				{data ? data.map((item) => (
					<tr key={item.id_paciente}>
						<td>{item.id_paciente}</td>
						<td>{item.nome}</td>
						<td>{item.cpf}</td>
						<td>{item.data_nascimento}</td>
						<td>{item.endereco}</td>
            <td>
              <button onClick={() => handleDelete(item.id_paciente)}>
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

export default Pacientes
