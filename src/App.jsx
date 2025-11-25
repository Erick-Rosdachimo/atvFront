import { useState } from 'react'
import './App.css'
import Consultas from './components/Consultas'
import Departamentos from './components/Departamentos'
import Medicos from './components/Medicos'
import Pacientes from './components/Pacientes'

function App() {
  const [dataPaciente, setDataPaciente] = useState([])
  const [dataDepartamento, setDataDepartamento] = useState([])
  const [dataMedico, setDataMedico] = useState([])  
  const [dataConsulta, setDataConsulta] = useState([])  
  const [fetchData, setFetchData] = useState(0)
 
  return (
    <>
      <h1>Sistema de gerenciamento hospitalar</h1>
      <Pacientes data={dataPaciente} setData={setDataPaciente} fetch={fetchData} setFetchData={setFetchData}/>
      <Departamentos data={dataDepartamento} setData={setDataDepartamento}  fetch={fetchData} setFetchData={setFetchData}/>
      <Medicos data={dataMedico} setData={setDataMedico} departamentos={dataDepartamento}  fetch={fetchData} setFetchData={setFetchData}/>
      <Consultas data={dataConsulta} setData={setDataConsulta} pacientes={dataPaciente} medicos={dataMedico} fetch={fetchData}/>
    </>
  )
}

export default App
