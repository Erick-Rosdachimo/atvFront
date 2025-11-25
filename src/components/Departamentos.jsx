import { useEffect, useState } from 'react'
import axios from 'axios';

function Departamentos({ data, setData }) {
  const [form, setForm] = useState({
    nome: "",
    localizacao: ""
  });

  const [editingId, setEditingId] = useState(null); 

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/departamento");
      setData(res.data.msg);
    } catch (erro) {
      console.log(erro);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (editingId) {
      try {
        await axios.put("http://localhost:3000/departamento", {
          id_departamento: editingId,
          ...form
        });

        setEditingId(null);
        setForm({ nome: "", localizacao: "" });
        fetchData();
      } catch (erro) {
        console.error("Erro ao atualizar departamento:", erro);
        alert("Erro ao atualizar departamento");
      }
      return;
    }

    
    try {
      await axios.post("http://localhost:3000/departamento", form);

      setForm({ nome: "", localizacao: "" });
      fetchData();
    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);
      alert("Erro ao cadastrar departamento");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_departamento);

    setForm({
      nome: item.nome,
      localizacao: item.localizacao
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar este departamento?")) return;

    try {
      await axios.delete("http://localhost:3000/departamento", {
        data: { id_departamento: id }
      });

      fetchData();
    } catch (erro) {
      if (erro.response?.status === 404) {
        alert("Erro 404: Departamento não encontrado.");
        fetchData();
      }
      console.error("Erro ao deletar:", erro);
      alert("Erro ao deletar departamento");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h2>Departamentos</h2>

      <div>
        <h3>{editingId ? "Editar Departamento" : "Criar Departamento"}</h3>

        <form onSubmit={handleSubmit}>
          <input
            required
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <input
            required
            placeholder="Localização"
            value={form.localizacao}
            onChange={(e) => setForm({ ...form, localizacao: e.target.value })}
          />

          <button>{editingId ? "Atualizar" : "Enviar"}</button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ nome: "", localizacao: "" });
              }}
            >
              Cancelar
            </button>
          )}
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
          {data?.map((item) => (
            <tr key={item.id_departamento}>
              <td>{item.id_departamento}</td>
              <td>{item.nome}</td>
              <td>{item.localizacao}</td>

              <td>
                <button onClick={() => handleEdit(item)}>Editar</button>
                <button onClick={() => handleDelete(item.id_departamento)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Departamentos;
