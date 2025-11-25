import { useEffect, useState } from 'react';
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

function Pacientes({ data, setData, fetch,setFetchData }) {

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    data_nascimento: "",
    endereco: ""
  });

  const [editId, setEditId] = useState(null); 

 
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/paciente");
      setData(res.data?.msg || []);
    } catch (erro) {
      console.error("Erro ao buscar pacientes:", erro);
      alert("Erro ao carregar pacientes.");
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId !== null) {
      return handleUpdate();
    }

    try {
      await axios.post("http://localhost:3000/paciente", form);

      resetForm();
      fetchData();

    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);
      alert("Erro ao cadastrar paciente.");
    }
  };

  
  const handleUpdate = async () => {
    try {
      const res = await axios.put("http://localhost:3000/paciente", {
        id_paciente: editId,
        ...form
      });

      console.log("Paciente atualizado:", res.data);

      resetForm();
      fetchData();

    } catch (erro) {
      console.error("Erro ao atualizar:", erro);

      if (erro.response) {
        if (erro.response.status === 404) alert("Paciente não encontrado.");
        else if (erro.response.status === 400) alert("Dados inválidos.");
        else alert("Erro ao atualizar o paciente.");
      } else {
        alert("Não foi possível conectar ao servidor.");
      }
    }
  };

 
  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar este paciente?")) return;

    try {
      await axios.delete("http://localhost:3000/paciente", {
        data: { id_paciente: id }
      });

      fetchData();
      setFetchData(fetch + 1);

    } catch (erro) {
      console.error("Erro ao deletar:", erro);

      if (erro.response?.status === 404) {
        alert("Paciente não encontrado.");
      } else {
        alert("Erro ao deletar.");
      }
    }
  };


  const loadEdit = (item) => {
    setEditId(item.id_paciente);

    setForm({
      nome: item.nome,
      cpf: item.cpf,
      data_nascimento: formatDateToInput(item.data_nascimento),
      endereco: item.endereco
    });
  };

  const resetForm = () => {
    setForm({
      nome: "",
      cpf: "",
      data_nascimento: "",
      endereco: ""
    });
    setEditId(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h2>Pacientes</h2>

      <div>
        <h3>{editId ? "Editar paciente" : "Criar paciente"}</h3>

        <form onSubmit={handleSubmit}>
          <input
            required
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <input
            required
            placeholder="CPF"
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
          />

          <input
            required
            type="date"
            value={form.data_nascimento}
            onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })}
          />

          <input
            required
            placeholder="Endereço"
            value={form.endereco}
            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          />

          <button>{editId ? "Salvar alterações" : "Enviar"}</button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ marginLeft: "10px" }}
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID Paciente</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Data Nascimento</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id_paciente}>
                <td>{item.id_paciente}</td>
                <td>{item.nome}</td>
                <td>{item.cpf}</td>
                <td>{formatDateToInput(item.data_nascimento)}</td>
                <td>{item.endereco}</td>

                <td>
                  <button onClick={() => loadEdit(item)}>Editar</button>
                  <button
                    onClick={() => handleDelete(item.id_paciente)}
                    style={{ marginLeft: "5px" }}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6">Nenhum paciente encontrado</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default Pacientes;
