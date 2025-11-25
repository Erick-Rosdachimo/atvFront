import { useEffect, useState } from 'react'
import './Consultas.css'
import axios from 'axios';

function Consultas({data, setData, pacientes, medicos}) {
 const [form, setForm] = useState({
    id_paciente: "",
    id_medico: "",
    data_consulta: "",
    duracao_min: "",
    diagnostico: "",
    observacoes: ""
  });

  const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/consulta");
				setData(res.data.msg)
				console.log(res)
      } catch (erro) {
        console.log(erro);
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/consulta", form);
      console.log("Consulta cadastrada:", res.data);
      
      setForm({
        id_paciente: "",
        id_medico: "",
        data_consulta: "",
        duracao_min: "",
        diagnostico: "",
        observacoes: ""
      });

      fetchData()
    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);
      alert("Erro ao cadastrar consulta");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar esta consulta?")) return;

    try {
      await axios.delete(`http://localhost:3000/consulta`, {
        data: { id_consulta: id }
      });
      fetchData();
    } catch (erro) {
      if (erro.response.status === 404) {
        alert("Erro 404: Consulta não encontrada.");
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
      <h2>Consultas</h2>

			<div>
				<h3>Criar consultas</h3>

        <form onSubmit={handleSubmit}>
          <select
            required
            value={form.id_paciente}
            onChange={(e) =>
              setForm({ ...form, id_paciente: e.target.value })
            }
          >
            <option value="">Selecione o paciente</option>

            {pacientes?.map((pac) => (
              <option key={pac.id_paciente} value={pac.id_paciente}>
                {pac.nome}
              </option>
            ))}
          </select>

          <select
            required
            value={form.id_medico}
            onChange={(e) =>
              setForm({ ...form, id_medico: e.target.value })
            }
          >
            <option value="">Selecione o médico</option>

            {medicos?.map((med) => (
              <option key={med.id_medico} value={med.id_medico}>
                {med.nome}
              </option>
            ))}
          </select>

          <input
            required
            type="date"
            name="data_consulta"
            value={form.data_consulta}
            onChange={(e) => setForm({ ...form, data_consulta: e.target.value })}
          />

          <input
            required
            type="number"
            name="duracao_min"
            value={form.duracao_min}
            onChange={(e) => setForm({ ...form, duracao_min: e.target.value })}
          />

          <input
            required
            placeholder="Diagnostico"
            name="diagnostico"
            value={form.diagnostico}
            onChange={(e) => setForm({ ...form, diagnostico: e.target.value })}
          />

          <input
            required
            placeholder="Observações"
            name="observacoes"
            value={form.observacoes}
            onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
          />
          <button>Enviar</button>
        </form>   
			</div>

      <table>
			<thead>
				<tr>
          <th>ID Consulta</th>
          <th>ID Paciente</th>
          <th>ID Médico</th>
          <th>Data</th>
          <th>Duração (min)</th>
          <th>Diagnóstico</th>
          <th>Observações</th>
          <th>Ações</th>
        </tr>
			</thead>
      <tbody>
				{data ? data.map((item) => (
					<tr key={item.id_consulta}>
						<td>{item.id_consulta}</td>
						<td>{item.id_paciente}</td>
						<td>{item.id_medico}</td>
						<td>{item.data_consulta}</td>
						<td>{item.duracao_min}</td>
						<td>{item.diagnostico}</td>
						<td>{item.observacoes}</td>
            <td>
              <button onClick={() => handleDelete(item.id_consulta)}>
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

export default Consultas
