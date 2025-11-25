import { useEffect, useState } from 'react'
import './Consultas.css'
import axios from 'axios';

function formatDateToInput(dateString) {
  if (!dateString) return "";

  
  if (dateString.includes("T")) {
    return dateString.split("T")[0];
  }

  
  const parts = dateString.split("/");
  if (parts.length === 3) {
    const [dia, mes, ano] = parts;
    return `${ano}-${mes}-${dia}`;
  }

  
  return dateString;
}

function Consultas({ data, setData, pacientes, medicos }) {

  const [form, setForm] = useState({
    id_paciente: "",
    id_medico: "",
    data_consulta: "",
    duracao_min: "",
    diagnostico: "",
    observacoes: ""
  });

  const [editId, setEditId] = useState(null); 

  
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/consulta");
      setData(res.data.msg || []);
    } catch (erro) {
      console.error(erro);
      alert("Erro ao carregar consultas.");
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (editId !== null) {
      return handleUpdate();
    }

    try {
      await axios.post("http://localhost:3000/consulta", form);

      resetForm();
      fetchData();

    } catch (erro) {
      console.error(erro);
      alert("Erro ao cadastrar consulta.");
    }
  };

  
  const handleUpdate = async () => {
    try {
      const res = await axios.put("http://localhost:3000/consulta", {
        id_consulta: editId,
        ...form
      });

      console.log("Atualizada:", res.data);

      resetForm();
      fetchData();

    } catch (erro) {
      if (erro.response) {
        if (erro.response.status === 404) alert("Consulta não encontrada.");
        else alert("Erro ao atualizar.");
      } else {
        alert("Erro de conexão.");
      }
    }
  };

  const resetForm = () => {
    setForm({
      id_paciente: "",
      id_medico: "",
      data_consulta: "",
      duracao_min: "",
      diagnostico: "",
      observacoes: ""
    });
    setEditId(null);
  };

  
  const handleDelete = async (id) => {
    if (!confirm("Deseja deletar?")) return;

    try {
      await axios.delete("http://localhost:3000/consulta", {
        data: { id_consulta: id }
      });
      fetchData();
    } catch (erro) {
      if (erro.response?.status === 404) {
        alert("Consulta não encontrada.");
      } else {
        alert("Erro ao deletar.");
      }
    }
  };

  const loadEdit = (item) => {
    setEditId(item.id_consulta);

    setForm({
      id_paciente: item.id_paciente,
      id_medico: item.id_medico,
      data_consulta: formatDateToInput(item.data_consulta),
      duracao_min: item.duracao_min,
      diagnostico: item.diagnostico,
      observacoes: item.observacoes
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h2>Consultas</h2>

      <div>
        <h3>{editId ? "Editar consulta" : "Criar consulta"}</h3>

        <form onSubmit={handleSubmit}>

          <select
            required
            value={form.id_paciente}
            onChange={(e) => setForm({ ...form, id_paciente: e.target.value })}
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
            onChange={(e) => setForm({ ...form, id_medico: e.target.value })}
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
            value={form.data_consulta}
            onChange={(e) => setForm({ ...form, data_consulta: e.target.value })}
          />

          <input
            required
            type="number"
            placeholder="Duração (min)"
            value={form.duracao_min}
            onChange={(e) => setForm({ ...form, duracao_min: e.target.value })}
          />

          <input
            required
            placeholder="Diagnóstico"
            value={form.diagnostico}
            onChange={(e) => setForm({ ...form, diagnostico: e.target.value })}
          />

          <input
            required
            placeholder="Observações"
            value={form.observacoes}
            onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
          />

          <button>{editId ? "Salvar Alterações" : "Enviar"}</button>

          {editId && (
            <button type="button" onClick={resetForm} style={{ marginLeft: "10px" }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID Consulta</th>
            <th>ID Paciente</th>
            <th>ID Médico</th>
            <th>Data</th>
            <th>Duração</th>
            <th>Diagnóstico</th>
            <th>Observações</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id_consulta}>
                <td>{item.id_consulta}</td>
                <td>{item.id_paciente}</td>
                <td>{item.id_medico}</td>
                <td>{formatDateToInput(item.data_consulta)}</td>
                <td>{item.duracao_min}</td>
                <td>{item.diagnostico}</td>
                <td>{item.observacoes}</td>
                <td>
                  <button onClick={() => loadEdit(item)}>Editar</button>
                  <button onClick={() => handleDelete(item.id_consulta)} style={{ marginLeft: "5px" }}>
                    Deletar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="8">Nenhuma consulta encontrada</td></tr>
          )}
        </tbody>

      </table>
    </>
  );
}

export default Consultas;
