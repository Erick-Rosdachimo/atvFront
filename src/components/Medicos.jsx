import { useEffect, useState } from 'react'
import axios from 'axios';

function Medicos({data, setData, departamentos}) {
  const [form, setForm] = useState({
    nome: "",
    crm: "",
    especialidade: "",
    data_contratacao: "",
    id_departamento: ""
  });

  const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/medico");
				setData(res.data.msg)
				console.log(res)
      } catch (erro) {
        console.log(erro);
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/medico", form);
      console.log("Médico cadastrado:", res.data);
      
      setForm({
        nome: "",
        crm: "",
        especialidade: "",
        data_contratacao: "",
        id_departamento: ""
      });

      fetchData()
    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);
      alert("Erro ao cadastrar médico");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar este médico?")) return;

    try {
      await axios.delete(`http://localhost:3000/medico`, {
        data: { id_medico: id }
      });
      fetchData();
    } catch (erro) {
      if (erro.response.status === 404) {
        alert("Erro 404: Medico não encontrado.");
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
      <h2>Médico</h2>

			<div>
				<h3>Criar médico</h3>

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
            placeholder="CRM"
            name="crm"
            value={form.crm}
            onChange={(e) => setForm({ ...form, crm: e.target.value })}
          />

          <input
            required
            placeholder="Especialidade"
            name="especialidade"
            value={form.especialidade}
            onChange={(e) => setForm({ ...form, especialidade: e.target.value })}
          />

          <input
            required
            type="date"
            name="data_contratacao"
            value={form.data_contratacao}
            onChange={(e) => setForm({ ...form, data_contratacao: e.target.value })}
          />

          <select
            required
            value={form.id_departamento}
            onChange={(e) =>
              setForm({ ...form, id_departamento: e.target.value })
            }
          >
            <option value="">Selecione o departamento</option>

            {departamentos?.map((dep) => (
              <option key={dep.id_departamento} value={dep.id_departamento}>
                {dep.nome}
              </option>
            ))}
          </select>

          <button>Enviar</button>
        </form>   
			</div>

      <table>
			<thead>
				<tr>
          <th>ID Médico</th>
          <th>Nome</th>
          <th>CRM</th>
          <th>Especialidade</th>
          <th>Data contratação</th>
          <th>ID Departamento</th>
          <th>Ações</th>
        </tr>
			</thead>
      <tbody>
				{data ? data.map((item) => (
					<tr key={item.id_medico}>
						<td>{item.id_medico}</td>
						<td>{item.nome}</td>
						<td>{item.crm}</td>
						<td>{item.especialidade}</td>
						<td>{item.data_contratacao}</td>
						<td>{item.id_departamento}</td>
            <td>
              <button onClick={() => handleDelete(item.id_medico)}>
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

export default Medicos
