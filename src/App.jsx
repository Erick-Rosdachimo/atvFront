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

  return (
    <>
      <h1>Sistema de gerenciamento hospitalar</h1>
      <Pacientes data={dataPaciente} setData={setDataPaciente}/>
      <Departamentos data={dataDepartamento} setData={setDataDepartamento}/>
      <Medicos data={dataMedico} setData={setDataMedico} departamentos={dataDepartamento}/>
      <Consultas data={dataConsulta} setData={setDataConsulta} pacientes={dataPaciente} medicos={dataMedico}/>
    </>
  )
}

export default App
