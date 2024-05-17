import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes necesarios para Chart.js
ChartJS.register(
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [datos, setDatos] = useState({
    numeroUsuarios: '',
    anchoBandaCanal: '',
    anchoBandaGuarda: '',
    frecuenciaCentralCanal1: '',
  });
  const [errors, setErrors] = useState({});
  const [resultados, setResultados] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar que solo se acepten números enteros
    if (/^\d*$/.test(value)) {
      setDatos({
        ...datos,
        [name]: value,
      });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!datos.numeroUsuarios || datos.numeroUsuarios <= 0 || datos.numeroUsuarios > 50) {
      tempErrors.numeroUsuarios = "Número de usuarios debe ser mayor que 0 y menor o igual a 50";
    }
    if (!datos.anchoBandaCanal || datos.anchoBandaCanal <= 0) {
      tempErrors.anchoBandaCanal = "Ancho de banda por canal debe ser mayor que 0";
    }
    if (!datos.anchoBandaGuarda || datos.anchoBandaGuarda < 0) {
      tempErrors.anchoBandaGuarda = "Ancho de banda de guarda no puede ser negativo";
    }
    if (!datos.frecuenciaCentralCanal1 || datos.frecuenciaCentralCanal1 <= 0 || datos.frecuenciaCentralCanal1 > 1000) {
      tempErrors.frecuenciaCentralCanal1 = "Frecuencia central del canal 1 debe ser mayor que 0 y menor o igual a 1000 MHz";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const numeroUsuarios = parseInt(datos.numeroUsuarios);
    const anchoBandaCanal = parseFloat(datos.anchoBandaCanal);
    const anchoBandaGuarda = parseFloat(datos.anchoBandaGuarda);
    const frecuenciaCentralCanal1 = parseFloat(datos.frecuenciaCentralCanal1);

    // Calcular frecuencias portadoras
    const frecuencias = [];
    for (let i = 1; i <= numeroUsuarios; i++) {
      frecuencias.push(
        frecuenciaCentralCanal1 + (i - 1) * (anchoBandaCanal + anchoBandaGuarda) / 1000
      );
    }

    // Calcular ancho de banda total
    const anchoBandaTotal = (anchoBandaCanal + anchoBandaGuarda) * numeroUsuarios - anchoBandaGuarda;
    // Calcular tasa total de Kbps
    const tasaKbpsTotal = numeroUsuarios * 100;
    // Calcular tasa de Kbps sin bandas de guarda
    const tasaKbpsTotalSinGuarda = numeroUsuarios * anchoBandaCanal * 2;

    setResultados({
      numeroUsuarios,
      anchoBandaCanal,
      anchoBandaGuarda,
      frecuenciaCentralCanal1,
      frecuencias,
      anchoBandaTotal,
      tasaKbpsTotal,
      tasaKbpsTotalSinGuarda,
    });

    // Limpiar el formulario
    setDatos({
      numeroUsuarios: '',
      anchoBandaCanal: '',
      anchoBandaGuarda: '',
      frecuenciaCentralCanal1: '',
    });
    setErrors({});
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Multiplexación por División en Frecuencia
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Número de usuarios"
            name="numeroUsuarios"
            type="number"
            value={datos.numeroUsuarios}
            onChange={handleChange}
            error={!!errors.numeroUsuarios}
            helperText={errors.numeroUsuarios}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Ancho de banda por canal (kHz)"
            name="anchoBandaCanal"
            type="number"
            value={datos.anchoBandaCanal}
            onChange={handleChange}
            error={!!errors.anchoBandaCanal}
            helperText={errors.anchoBandaCanal}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Ancho de banda de guarda (kHz)"
            name="anchoBandaGuarda"
            type="number"
            value={datos.anchoBandaGuarda}
            onChange={handleChange}
            error={!!errors.anchoBandaGuarda}
            helperText={errors.anchoBandaGuarda}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Frecuencia central del canal 1 (MHz)"
            name="frecuenciaCentralCanal1"
            type="number"
            value={datos.frecuenciaCentralCanal1}
            onChange={handleChange}
            error={!!errors.frecuenciaCentralCanal1}
            helperText={errors.frecuenciaCentralCanal1}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Calcular
          </Button>
        </Grid>
      </Grid>

      {resultados && (
        <Paper style={{ marginTop: '20px', padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Resultados
          </Typography>
          <Typography gutterBottom>
            <strong>Número de usuarios:</strong> {resultados.numeroUsuarios}
          </Typography>
          <Typography gutterBottom>
            <strong>Ancho de banda por canal:</strong> {resultados.anchoBandaCanal} kHz
          </Typography>
          <Typography gutterBottom>
            <strong>Ancho de banda de guarda:</strong> {resultados.anchoBandaGuarda} kHz
          </Typography>
          <Typography gutterBottom>
            <strong>Frecuencia central del canal 1:</strong> {resultados.frecuenciaCentralCanal1} MHz
          </Typography>
          <Typography gutterBottom>
            <strong>Ancho de banda total:</strong> {resultados.anchoBandaTotal.toFixed(2)} kHz
          </Typography>
          <Typography gutterBottom>
            <strong>Número total de Kbps que se transmiten:</strong> {resultados.tasaKbpsTotal.toFixed(2)} kbps
          </Typography>
          <Typography gutterBottom>
            <strong>Número total de Kbps que podrían transmitirse utilizando todo el ancho de banda:</strong> {resultados.tasaKbpsTotalSinGuarda.toFixed(2)} kbps
          </Typography>

          <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Frecuencia Portadora (MHz)</TableCell>
                  <TableCell>Ancho de Banda del Canal (kHz)</TableCell>
                  <TableCell>Ancho de Banda de Guarda (kHz)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultados.frecuencias.map((freq, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{freq.toFixed(6)}</TableCell>
                    <TableCell>{resultados.anchoBandaCanal}</TableCell>
                    <TableCell>{resultados.anchoBandaGuarda}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Bar
            data={{
              labels: resultados.frecuencias.map((_, index) => `Usuario ${index + 1}`),
              datasets: [
                {
                  label: 'Frecuencia Portadora (MHz)',
                  data: resultados.frecuencias,
                  backgroundColor: 'rgba(153,102,255,0.6)',
                  borderColor: 'rgba(153,102,255,1)',
                },
              ],
            }}
            options={{
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Usuarios',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Frecuencia Portadora (MHz)',
                  },
                },
              },
            }}
          />
        </Paper>
      )}
    </Container>
  );
}

export default App;
