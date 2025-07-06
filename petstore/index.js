const https = require('https');
const PetNameCounter = require('./PetNameCounter');

const BASE_URL = 'petstore.swagger.io';
const HEADERS = {
  'Content-Type': 'application/json'
};

// Función para realizar una solicitud HTTPS
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path,
      method,
      headers: HEADERS
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => (body += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function main() {
  const userData = {
    id: 1001,
    username: 'nativeuser',
    firstName: 'Node',
    lastName: 'JS',
    email: 'nodejs@example.com',
    password: '123456',
    phone: '0000000000',
    userStatus: 1
  };

  try {
    // 1. Crear usuario
    const createUser = await makeRequest('POST', '/v2/user', userData);
    console.log('✅ Usuario creado:', createUser);

    // 2. Recuperar usuario
    const getUser = await makeRequest('GET', `/v2/user/${userData.username}`);
    console.log('✅ Usuario recuperado:', getUser);

    // 3. Obtener mascotas "sold"
    const soldPets = await makeRequest('GET', '/v2/pet/findByStatus?status=sold');

    // 4. Crear tuplas {id, name}
    const petTuples = soldPets
      .filter(pet => pet && pet.id)
      .map(pet => ({
        id: pet.id,
        name: pet.name || 'Unknown'
      }));

    console.log('📋 Mascotas vendidas (id, name):', petTuples);

    // 5. Contar nombres
    const counter = new PetNameCounter(petTuples);
    const result = counter.countNames();

    console.log('📊 Conteo de nombres:', result);
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

main();